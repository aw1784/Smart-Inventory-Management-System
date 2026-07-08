const request = require('supertest');
const jwt = require('jsonwebtoken');
const { isPublic } = require('../middleware/authMiddleware');
const app = require('../server');

describe('API Gateway', () => {
  it('exposes a health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('api-gateway');
  });

  it('classifies signup/signin as public', () => {
    expect(isPublic('/api/auth/signin')).toBe(true);
    expect(isPublic('/api/auth/signup')).toBe(true);
    expect(isPublic('/health')).toBe(true);
    expect(isPublic('/api/products')).toBe(false);
  });

  it('rejects protected routes without a token', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(401);
  });

  it('rejects invalid tokens', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('decodes valid tokens', () => {
    const secret = process.env.JWT_SECRET || 'change-me-in-production';
    const token = jwt.sign({ id: '123', role: 'admin' }, secret);
    const decoded = jwt.verify(token, secret);
    expect(decoded.role).toBe('admin');
  });
});
