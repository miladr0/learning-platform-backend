const express = require('express');
const customerRoutes = require('./customer.route');
const studentRoutes = require('./student.router');
const courseRoutes = require('./course.route');


const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */

router.use('/customers', customerRoutes);
router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);



module.exports = router;
