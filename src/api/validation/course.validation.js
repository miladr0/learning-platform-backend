const Joi = require('joi');

module.exports = {

  // GET /v1/courses/course-statics/:studentId/:courseId
  courseStatics: {
    params: {
        studentId: Joi.number().integer().required(),
      courseId: Joi.number().integer().required(),
    }
  },
};
