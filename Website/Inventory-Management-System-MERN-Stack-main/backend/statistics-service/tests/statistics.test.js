const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');

let mongoServer;

const mockFetch = (urlMap) => {
  global.fetch = jest.fn(async (url) => {
    const body = urlMap[url];
    if (body === undefined) return { ok: false };
    return { ok: true, json: async () => body };
  });
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Statistics Service', () => {
  it('records a stat', async () => {
    const res = await request(app)
      .post('/api/statistics')
      .send({ metric: 'orders', value: 10 });
    expect(res.status).toBe(201);
    expect(res.body.stat.value).toBe(10);
  });

  it('aggregates summary across services', async () => {
    mockFetch({
      'http://localhost:4002/api/products': { products: [{}, {}, {}] },
      'http://localhost:4003/api/orders': {
        orders: [
          { status: 'paid', totalAmount: 100 },
          { status: 'pending', totalAmount: 50 },
        ],
      },
      'http://localhost:4004/api/inventory': {
        items: [{ quantity: 10 }, { quantity: 5 }],
      },
      'http://localhost:4001/api/auth/users': { users: [{ role: 'admin' }] },
    });
    const res = await request(app).get('/api/statistics/summary');
    expect(res.status).toBe(200);
    expect(res.body.summary.products).toBe(3);
    expect(res.body.summary.orders).toBe(2);
    expect(res.body.summary.users).toBe(1);
    expect(res.body.summary.revenue).toBe(100);
    expect(res.body.summary.totalStock).toBe(15);
  });

  it('returns order stats grouped by status', async () => {
    mockFetch({
      'http://localhost:4003/api/orders': {
        orders: [
          { status: 'paid', totalAmount: 100 },
          { status: 'paid', totalAmount: 50 },
          { status: 'pending', totalAmount: 20 },
        ],
      },
    });
    const res = await request(app).get('/api/statistics/orders');
    expect(res.status).toBe(200);
    expect(res.body.stats.total).toBe(3);
    expect(res.body.stats.totalRevenue).toBe(150);
    expect(res.body.stats.byStatus.paid).toBe(2);
    expect(res.body.stats.byStatus.pending).toBe(1);
  });

  it('returns user stats grouped by role', async () => {
    mockFetch({
      'http://localhost:4001/api/auth/users': {
        users: [{ role: 'admin' }, { role: 'user' }, { role: 'user' }],
      },
    });
    const res = await request(app).get('/api/statistics/users');
    expect(res.status).toBe(200);
    expect(res.body.stats.total).toBe(3);
    expect(res.body.stats.byRole.user).toBe(2);
    expect(res.body.stats.byRole.admin).toBe(1);
  });
});
