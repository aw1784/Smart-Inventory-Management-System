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

describe('Inventory Service', () => {
  let recordId;
  const productId = new mongoose.Types.ObjectId().toString();

  it('adds an inventory record', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .send({ productId, productName: 'Keyboard', quantity: 10 });
    expect(res.status).toBe(201);
    expect(res.body.item.quantity).toBe(10);
    recordId = res.body.item._id;
  });

  it('lists inventory', async () => {
    const res = await request(app).get('/api/inventory');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('fetches by productId', async () => {
    const res = await request(app).get(`/api/inventory/product/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.item.productId).toBe(productId);
  });

  it('adjusts quantity up', async () => {
    const res = await request(app)
      .patch(`/api/inventory/${recordId}/adjust`)
      .send({ delta: 5 });
    expect(res.status).toBe(200);
    expect(res.body.item.quantity).toBe(15);
  });

  it('rejects negative adjustment beyond stock', async () => {
    const res = await request(app)
      .patch(`/api/inventory/${recordId}/adjust`)
      .send({ delta: -1000 });
    expect(res.status).toBe(400);
  });

  it('removes record', async () => {
    const res = await request(app).delete(`/api/inventory/${recordId}`);
    expect(res.status).toBe(200);
  });
});
