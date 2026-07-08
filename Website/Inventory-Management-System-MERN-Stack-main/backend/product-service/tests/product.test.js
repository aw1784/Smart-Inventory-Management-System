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

describe('Product Service', () => {
  let createdId;

  it('creates a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Laptop', price: 1200, category: 'Electronics', sku: 'LAP-1' });
    expect(res.status).toBe(201);
    expect(res.body.product.name).toBe('Laptop');
    createdId = res.body.product._id;
  });

  it('lists products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it('fetches product by id', async () => {
    const res = await request(app).get(`/api/products/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.product._id).toBe(createdId);
  });

  it('updates product', async () => {
    const res = await request(app).put(`/api/products/${createdId}`).send({ price: 999 });
    expect(res.status).toBe(200);
    expect(res.body.product.price).toBe(999);
  });

  it('deletes product', async () => {
    const res = await request(app).delete(`/api/products/${createdId}`);
    expect(res.status).toBe(200);
  });

  it('returns 404 for missing product', async () => {
    const res = await request(app).get(`/api/products/${createdId}`);
    expect(res.status).toBe(404);
  });
});
