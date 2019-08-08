const httpStatus = require('http-status');
const Customer = require('../models/customer.model');
const Student = require('../models/student.model');


/**
 * Get customers
 * @public
 */
exports.list = async (req, res, next) => {
  try {
      const customers = await Customer.list(req.query);
    res.json(customers);
  } catch (error) {
    next(error);
  }
};


exports.insertCustomerAnswers = async (req, res, next) => {
  try {
      let allCustomers = await Customer.getAllCustomers();
      allCustomers = allCustomers.rows;

     
      for(let i=0; i< allCustomers.length; i++) {
        await Student.insertCustomerAnswers(allCustomers[i].id);
      }

    res.json(allCustomers);
  } catch (error) {
    next(error);
  }
};