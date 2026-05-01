const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');

let mongoServer;

const mockInventoryFetch = ({ shouldFail = false } = {}) => {
  global.fetch = jest.fn(async () =>
    shouldFail
      ? { ok: false, status: 409, json: async () => ({ message: 'Insufficient stock' }) }
      : { ok: true, status: 200, json: async () => ({ item: { quantity: 0 } }) }
  );
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Order Service', () => {
  let orderId;
  const userId = new mongoose.Types.ObjectId().toString();
  const productId = new mongoose.Types.ObjectId().toString();

  it('places an order and decrements inventory', async () => {
    mockInventoryFetch();
    const res = await request(app)
      .post('/api/orders')
      .send({ userId, items: [{ productId, name: 'Mouse', quantity: 2, price: 25 }] });
    expect(res.status).toBe(201);
    expect(res.body.order.totalAmount).toBe(50);
    expect(global.fetch).toHaveBeenCalled();
    orderId = res.body.order._id;
  });

  it('rejects when inventory is insufficient', async () => {
    mockInventoryFetch({ shouldFail: true });
    const res = await request(app)
      .post('/api/orders')
      .send({ userId, items: [{ productId, name: 'Mouse', quantity: 999, price: 25 }] });
    expect(res.status).toBe(409);
  });

  it('rejects empty orders', async () => {
    const res = await request(app).post('/api/orders').send({ userId, items: [] });
    expect(res.status).toBe(400);
  });

  it('lists all orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(res.body.orders.length).toBeGreaterThan(0);
  });

  it('lists orders by user', async () => {
    const res = await request(app).get(`/api/orders/user/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.orders[0].userId).toBe(userId);
  });

  it('updates order status', async () => {
    mockInventoryFetch();
    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .send({ status: 'shipped' });
    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('shipped');
  });

  it('restores inventory when cancelling an order', async () => {
    mockInventoryFetch();
    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .send({ status: 'cancelled' });
    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('cancelled');
    // Should have called inventory adjust to restore stock
    expect(global.fetch).toHaveBeenCalled();
  });
});
