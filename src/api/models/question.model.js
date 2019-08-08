const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async getCourseQuestions(courseId = null) {
      if(!courseId) 
        throw Error('courseId not exist!');

    const result = await db.query(sql`
    with all_course_modules as (
      select course_module.module_id AS module_id FROM courses INNER JOIN course_module ON courses.cs_id = course_module.course_id 
       WHERE courses.cs_id=${courseId}
 )

select * FROM questions INNER JOIN module_question ON module_question.question_id = questions.q_id 
INNER JOIN all_course_modules ON all_course_modules.module_id = module_question.module_id

       `);
       return result;
  },
};
