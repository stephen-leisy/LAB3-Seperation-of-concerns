const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then((res) => {
        // expect(createMessage).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '1',
          quantity: 10,
        });
      });
  });

  it('ASYNC/AWAIT: creates a new order in our database and sends a text message', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    expect(res.body).toEqual({
      id: '1',
      quantity: 10,
    });
  });

  it('returns all orders in the database', async () => {
    await request(app).post('/api/v1/orders').send({ quantity: 10 });
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
    const order = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    const result = await request(app)
      .get(`/api/v1/orders/${order.body.id}`);

    expect(result.body).toEqual([
      {
        id: '1',
        quantity: 10,
      },
    ]);
  });

  it('it should alter an existing order by ID', async () => {
    const order = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    const whatItBeNow = await request(app)
      .put(`/api/v1/orders/${order.body.id}`)
      .send({ quantity: 500 });

    expect(whatItBeNow.body).toEqual({
      id: '1',
      quantity: 500,
    });
  });

  it('It should delete an order quantity by its id', async () => {
    const order = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });
    const wrongOrder = await request(app)
      .delete('/api/v1/orders/1')
    
    const checkIfExists = await request(app)
      .get('/api/v1/orders/1');

    

    expect(checkIfExists.body).toEqual([]);
  });
});
