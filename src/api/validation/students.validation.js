const Joi = require('joi');

module.exports = {

  // GET /v1/students/by-customer-id/:customerId
  studentsByCustomerId: {
    query: {
        skip: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(0).max(100),
        order: Joi.string().valid(['ASC', 'DESC']),
    },
    params: {
      customerId: Joi.number().integer(),
    }
  },
};
