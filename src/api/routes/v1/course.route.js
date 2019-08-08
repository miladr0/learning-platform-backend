const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/course.controller');

const {
    courseStatics,
} = require('../../validation/course.validation');

const router = express.Router();


  router
  .route('/course-statics/:studentId/:courseId')
  .get(validate(courseStatics), controller.studentCourseStatic);

module.exports = router;
