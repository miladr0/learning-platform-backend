const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/student.controller');

const {
    studentsByCustomerId,
} = require('../../validation/students.validation');

const router = express.Router();


router
  .route('/by-customer-id/:customerId')
  .get( validate(studentsByCustomerId), controller.studentsByCustomerId);

  router
  .route('/courses-by-student-id/:studentId')
  .get( controller.studentCourses);

  router
  .route('/all-answers/:studentId')
  .get( controller.allStudentAnswers);

  router
  .route('/answer-question')
  .post( controller.answerQuestion);

module.exports = router;
