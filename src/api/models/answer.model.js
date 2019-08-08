const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async insertCustomerAnswers(customerId = null) {
    if(!customerId) 
      throw Error('customerId not exist!');

  const result = await db.query(sql`
  with c_st_course as (
    select course_id AS cid, st_id AS sid FROM customers INNER JOIN students ON students.customer_id = customers.id 
    WHERE customers.id=${customerId}
), all_cs_modules as (
select module_id AS mid, sid FROM c_st_course INNER JOIN course_module ON course_module.course_id = c_st_course.cid
), all_qs_modules as (
  select question_id AS qid, mid, sid FROM all_cs_modules INNER JOIN module_question ON module_question.module_id = all_cs_modules.mid
  )

INSERT INTO answers(student_id, question_id, module_id, answer)
 SELECT sid, qid, mid, round(random()*3)+1 FROM all_qs_modules
 ON CONFLICT DO NOTHING;

     `);
     return result;
},

async getStudentAnswers(studentId = null, courseId = null) {
  if(!studentId || !courseId) 
    throw Error('(studentId and courseId not exist!');

const result = await db.query(sql`
with all_course_modules as (
  select course_module.module_id AS module_id FROM courses INNER JOIN course_module ON courses.cs_id = course_module.course_id 
   WHERE courses.cs_id=${courseId}
), all_qs_module as (
select questions.q_id AS qId, questions.correct_option AS correct_ans FROM questions INNER JOIN module_question ON module_question.question_id = questions.q_id 
INNER JOIN all_course_modules ON all_course_modules.module_id = module_question.module_id
)

select * FROM answers INNER JOIN all_qs_module ON all_qs_module.qId=answers.question_id WHERE student_id=${studentId}

   `);
   return result;
},
}
