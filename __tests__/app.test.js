const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order.js');

jest.mock('../lib/utils/twilio.js');
const twilio = require('../lib/utils/twilio.js');

describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  let order;
  beforeEach(async () => {
    order = await Order.insert({ quantity: 10 });
    twilio.sendSms.mockClear();
  });

  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then(() => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
      });
  });

  it('returns all orders in the database', async () => {
    await request(app).post('/api/v1/orders').send({ quantity: 1000 });

    const orders = await request(app).get('/api/v1/orders');

    expect(orders.body).toEqual([
      {
        id: '1',
        quantity: 10,
      },
      {
        id: '2',
        quantity: 1000,
      },
    ]);
  });

  it('it returns one specific order by its ID', async () => {
    const order = await request(app);

    const result = await request(app).get('/api/v1/orders/1');

    expect(result.body).toEqual([
      {
        id: '1',
        quantity: 10,
      },
    ]);
  });

  it('it should alter an existing order by ID', async () => {
    return request(app)
      .put(`/api/v1/orders/${order.id}`)
      .send({ quantity: 13 })
      .then(() => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
      });
  });

  it('It should delete an order quantity by its id', async () => {
    return request(app)
      .delete(`/api/v1/orders/${order.id}`)
      .then(() => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
      });
  });
});
