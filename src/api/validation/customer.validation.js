const Joi = require('joi');

module.exports = {

  // GET /v1/customers
  listCustomer: {
    query: {
        skip: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(0).max(100),
        order: Joi.string().valid(['ASC', 'DESC']),
    },
  },
};
