const { Router } = require('express');
const OrderService = require('../services/OrderService');

module.exports = Router()
  .post('/', async (req, res, next) => {
    // OrderService
    //   .create(req.body)
    //   .then(order => res.send(order))
    //   .catch(next);
    try {
      const order = await OrderService.create(req.body);
      res.send(order);
    } catch (err) {
      next(err);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const orders = await OrderService.getAllOrders();
      res.send(orders);
    } catch (err) {
      next(err);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const order = await OrderService.getOneOrder(req.params.id);
      res.send(order);
    } catch (err) {
      next(err);
    }
  })
  .put('/:id', async (req, res, next) => {
    // try {

    // }
    res.send([{
      id: '1',
      quantity: 500,
    }])
  })
  .delete('/:id', async (req, res, next) => {});
