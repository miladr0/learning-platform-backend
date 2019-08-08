const httpStatus = require('http-status');
const Student = require('../models/student.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');



/**
 * Get student course statics
 * @public
 */
exports.studentCourseStatic = async (req, res, next) => {
  try {
      const {studentId, courseId} = req.params;
      const [studentAnswers, allCourseQuestion] = await Promise.all([
        Answer.getStudentAnswers(studentId, courseId),
        Question.getCourseQuestions(courseId)
      ]);

      const staticResult = {
        correctPercentage: 0,
        totalCorrect:0,
        totalQuestion: 0,
        answers: []
      };

      if(studentAnswers && studentAnswers.rows.length && allCourseQuestion && allCourseQuestion.rows.length) {
        staticResult.answers = studentAnswers.rows;
        console.log(allCourseQuestion.rows);
        
        let correctAns = 0;
        staticResult.answers.forEach(ans => {
            const qiz = allCourseQuestion.rows.find(q => q.q_id === ans.question_id); 
            if(qiz && qiz.correct_option === ans.answer) {
                    correctAns++;
            }
        })

        staticResult.correctPercentage =  `${Math.round((correctAns * 100) / allCourseQuestion.rows.length)}%`;
        staticResult.totalCorrect =  correctAns;
        staticResult.totalQuestion =  allCourseQuestion.rows.length;
      }
    res.json(staticResult);
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


