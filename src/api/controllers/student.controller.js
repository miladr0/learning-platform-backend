const httpStatus = require('http-status');
const Student = require('../models/student.model');


/**
 * Get students by customerId
 * @public
 */
exports.studentsByCustomerId = async (req, res, next) => {
  try {
      const {customerId} = req.params;
      const students = await Student.getByCustomerId(req.query, customerId);
    res.json(students);
  } catch (error) {
    next(error);
  }
};


exports.studentCourses = async (req, res, next) => {
  try {
      const {studentId} = req.params;
      const students = await Student.studentCourses(studentId);
    res.json(students);
  } catch (error) {
    next(error);
  }
};


exports.allStudentAnswers = async (req, res, next) => {
  try {
      const {studentId} = req.params;
      const students = await Student.allStudentAnswers(studentId);
    res.json(students);
  } catch (error) {
    next(error);
  }
};


exports.answerQuestion = async (req, res, next) => {
  try {
      const {studentId, questionId, moduleId, answer} = req.body;
      const result = await Student.answerQuestion(studentId, questionId, moduleId, answer);
    res.json(result);
  } catch (error) {
    next(error);
  }
};


