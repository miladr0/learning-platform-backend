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

  async studentCourses(studentId = null) {
    if(!studentId) 
      throw Error('(studentId and courseId not exist!');


  const count = await db.query(sql`
      SELECT * FROM students INNER JOIN courses ON courses.cs_id = students.course_id
      WHERE students.st_id=${studentId};
     `);
     return count
},

async answerQuestion(studentId = null, questionId = null, moduleId = null, answer) {
  if(!studentId) 
    throw Error('(studentId and courseId not exist!');


const count = await db.query(sql`
INSERT INTO answers(student_id, question_id, module_id, answer) 
VALUES (${studentId}, ${questionId}, ${moduleId}, ${answer})
   `);
   return count;
},

async allStudentAnswers(studentId = null) {
  if(!studentId) 
    throw Error('(studentId!');


const count = await db.query(sql`
    SELECT * FROM answers
    WHERE student_id=${studentId};
   `);
   return count;
},

  async getCourseStatics(studentId = null, courseId = null) {
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

  async getByCustomerId({
    skip = 1,
    limit = 10,
    order = 'DESC',
    orderBy = 'id'
  }, customerId= null) {
      if(!customerId) 
        throw Error('customerId not found');

    const page = parseInt(skip || 1, 10);
    const limitData = parseInt(limit || 10, 10);
    const skipData = (page - 1) * limit;
    
    const [count, rows] = await Promise.all([
        db.query(sql`
        SELECT count(*) FROM students INNER JOIN customers ON customers.id = students.customer_id
        INNER JOIN courses ON courses.cs_id = students.course_id
        WHERE customers.id=${customerId};
       `),
        db.query(sql`
        SELECT * FROM students INNER JOIN customers ON customers.id = students.customer_id
        INNER JOIN courses ON courses.cs_id = students.course_id
        WHERE customers.id=${customerId} ORDER BY ${orderBy} DESC OFFSET ${skipData} LIMIT ${limitData};
       `)
    ]);

    const result = {
        'students': rows.rows,
        'total': count.rows[0].count,
        'limit': limit,
        'page': page,
      };
      return result;
  },

/**
 * List customers in descending order of id.
 * @param {number} skip - Number of customers to be skipped.
 * @param {number} limit - Limit number of customers to be returned.
 * @param {number} order - desc or acs.
 * @param {number} sortBy - sort return by which column.
 */
  async list({
      skip = 1,
      limit = 10,
      order = 'DESC',
      orderBy = 'id'
  }) {
    const page = parseInt(skip || 1, 10);
    const limitData = parseInt(limit || 10, 10);
    const skipData = (page - 1) * limit;

    // const actualQuery = `SELECT * FROM customers`;
    // const countQuery = actualQuery.replace('*', 'count(*)');
    
    const [count, rows] = await Promise.all([
        db.query(sql`
        SELECT count(*) FROM customers;
       `),
        db.query(sql`
        SELECT * FROM customers ORDER BY ${orderBy} DESC OFFSET ${skipData} LIMIT ${limitData};
       `)
    ]);

    const result = {
        'customers': rows.rows,
        'total': count.rows[0].count,
        'limit': limit,
        'page': page,
      };
      return result;
  } 
};
