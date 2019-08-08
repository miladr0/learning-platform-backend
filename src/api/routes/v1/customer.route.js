const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/customer.controller');

const {
  listCustomer,
} = require('../../validation/customer.validation');

const router = express.Router();


router
  .route('/')
  .get( validate(listCustomer), controller.list);

  router
  .route('/insert-all')
  .get( validate(listCustomer), controller.insertCustomerAnswers);

module.exports = router;
