const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Service', () => {
  const user = { name: 'Ahmed', email: 'ahmed@example.com', password: 'secret123' };
  let token;

  it('should sign up a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send(user);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
    token = res.body.token;
  });

  it('should reject duplicate signup', async () => {
    const res = await request(app).post('/api/auth/signup').send(user);
    expect(res.status).toBe(409);
  });

  it('should sign in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should reject sign in with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: user.email, password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('should fetch current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
  });

  it('should reject unauthorized access', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Admin user management', () => {
  let adminToken;
  let adminId;
  let regularToken;
  let regularId;

  beforeAll(async () => {
    // promote ahmed to admin (created in suite above)
    const userDoc = await mongoose.connection
      .collection('users')
      .findOneAndUpdate({ email: 'ahmed@example.com' }, { $set: { role: 'admin' } }, { returnDocument: 'after' });
    const adminEmail = (userDoc.value || userDoc).email;

    // sign in admin to get a token reflecting the new role
    const adminRes = await request(app)
      .post('/api/auth/signin')
      .send({ email: adminEmail, password: 'secret123' });
    adminToken = adminRes.body.token;
    adminId = adminRes.body.user._id;

    // create a regular user
    const regRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'secret123' });
    regularToken = regRes.body.token;
    regularId = regRes.body.user._id;
  });

  it('admin can list users', async () => {
    const res = await request(app)
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThanOrEqual(2);
  });

  it('regular user cannot list users', async () => {
    const res = await request(app)
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${regularToken}`);
    expect(res.status).toBe(403);
  });

  it('admin can promote a user to admin', async () => {
    const res = await request(app)
      .put(`/api/auth/users/${regularId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'admin' });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('admin');
  });

  it('admin can demote a user back to user', async () => {
    const res = await request(app)
      .put(`/api/auth/users/${regularId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'user' });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('user');
  });

  it('admin cannot demote themselves', async () => {
    const res = await request(app)
      .put(`/api/auth/users/${adminId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'user' });
    expect(res.status).toBe(400);
  });

  it('admin cannot delete themselves', async () => {
    const res = await request(app)
      .delete(`/api/auth/users/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(400);
  });

  it('admin can delete another user', async () => {
    const res = await request(app)
      .delete(`/api/auth/users/${regularId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe(String(regularId));
  });

  it('regular user cannot delete users', async () => {
    // create a fresh regular user
    const reg = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Carol', email: 'carol@example.com', password: 'secret123' });
    const res = await request(app)
      .delete(`/api/auth/users/${reg.body.user._id}`)
      .set('Authorization', `Bearer ${reg.body.token}`);
    expect(res.status).toBe(403);
  });
});
