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
    await request(app)
    .post('/api/v1/orders')
    .send({ quantity: 10 });
    await request(app)
    .post('/api/v1/orders')
    .send({ quantity: 1000 });
    
    const orders = await request(app)
      .get('/api/v1/orders')
  
    expect(orders.body).toEqual([{
      id: '1',
      quantity: 10,
    },
  {
      id: '2',
      quantity: 1000,
  }])
  
  });

  it('it returns one specific order by its ID', async () => {
    await request(app)
    .post('/api/v1/orders')
    .send({ quantity: 10 });

    const order = await request(app)
      .get('/api/v1/orders/?id=1')
    
    expect(order.body).toEqual([{
      id: '1',
      quantity: 10,
    }])


  })
});

