const db = require('../api/models/db');

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
  CREATE TABLE IF NOT EXISTS customers (
    id bigserial PRIMARY KEY,
     email text,
     phone text
   );
   
     CREATE TABLE IF NOT EXISTS courses (
     cs_id bigserial PRIMARY KEY,
     teacher_name text
   );
   
     CREATE TABLE IF NOT EXISTS students (
     st_id bigserial PRIMARY KEY,
     customer_id bigint REFERENCES customers (id),
     start_time TIMESTAMP without time zone DEFAULT now(),
     course_id bigint REFERENCES courses (cs_id),
     UNIQUE(customer_id, course_id)
   );
   
     CREATE TABLE IF NOT EXISTS modules (
     module_id bigserial PRIMARY KEY,
     name text
   );
 
   CREATE TABLE IF NOT EXISTS course_module (
     course_id bigint REFERENCES courses (cs_id),
     module_id bigint REFERENCES modules (module_id),
     UNIQUE(course_id, module_id)
   );
   
   CREATE TABLE IF NOT EXISTS questions (
     q_id bigserial PRIMARY KEY,
     title text,
     o1 text,
     o2 text,
     o3 text,
     o4 text,
     correct_option smallint,
     explanation text
   );
 
   CREATE TABLE IF NOT EXISTS answers (
     student_id bigint REFERENCES students (st_id),
     question_id bigint REFERENCES questions (q_id),
     module_id bigint REFERENCES modules (module_id),
     answer smallint,
     UNIQUE(student_id, question_id)
   );
 
 
   CREATE TABLE IF NOT EXISTS module_question (
     module_id bigint REFERENCES modules (module_id),
     question_id bigint REFERENCES questions (q_id),
     UNIQUE(module_id, question_id)
   );
   
   -- insert random into customers (max )
 INSERT INTO customers(email, phone)
 SELECT(
   SELECT concat_ws('_',name_first, name_last) as generated
   FROM (
     SELECT string_agg(x,'')
     FROM (
       select start_arr[ 1 + ( (random() * 25)::int) % 16 ]
       FROM
       (
           select '{CO,GE,FOR,SO,CO,GIM,SE,CO,GE,CA,FRA,GEC,GE,GA,FRO,GIP}'::text[] as start_arr
       ) syllarr,
       -- need 3 syllabes, and force generator interpretation with the '*0' (else 3 same syllabes)
       generate_series(1, 3 + (generator*0))
     ) AS comp3syl(x)
   ) AS comp_name_1st(name_first),
   (
     SELECT x[ 1 + ( (random() * 25)::int) % 14 ]
     FROM (		
       select '{Ltd,& Co,SARL,SA,Gmbh,United,Brothers,& Sons,International,Ext,Worldwide,Global,2000,3000}'::text[]
     ) AS z2(x)
   ) AS comp_name_last(name_last)
     ), random()
 FROM generate_series(1,10) as generator
 -- ignore duplicates company names
 ON CONFLICT DO NOTHING;
 
 -- create random course (max )
 INSERT INTO courses(teacher_name)
 SELECT(
   SELECT concat_ws(' ',name_first, name_last) as generated
   FROM (
     SELECT string_agg(x,'')
     FROM (
       select start_arr[ 1 + ( (random() * 25)::int) % 16 ]
       FROM
       (
           select '{CO,GE,FOR,SO,CO,GIM,SE,CO,GE,CA,FRA,GEC,GE,GA,FRO,GIP}'::text[] as start_arr
       ) syllarr,
       -- need 3 syllabes, and force generator interpretation with the '*0' (else 3 same syllabes)
       generate_series(1, 3 + (generator*0))
     ) AS comp3syl(x)
   ) AS comp_name_1st(name_first),
   (
     SELECT x[ 1 + ( (random() * 25)::int) % 14 ]
     FROM (		
       select '{Ltd,Co,SARL,SA,Gmbh,United,Brothers,Sons,International,Ext,Worldwide,Global,2000,3000}'::text[]
     ) AS z2(x)
   ) AS comp_name_last(name_last)
     )
 FROM generate_series(1,10) as generator
 -- ignore duplicates company names
 ON CONFLICT DO NOTHING;
 
 
 -- student part (max )
 INSERT INTO students(
 st_id,
 customer_id,
 course_id  
 )
 SELECT
 main_sub.id,
 main_sub.customer_id,
 main_sub.course_id
 FROM (
 SELECT
 (select  (random() * 10)::int + (generator*0) as customer_id),
 (select  (random() * 10)::int + (generator*0) as course_id),  
 generator as id
 FROM generate_series(1,100) as generator
 ) main_sub
 INNER JOIN customers ON customers.id = main_sub.customer_id
 INNER JOIN courses ON courses.cs_id = main_sub.course_id
 ON CONFLICT DO NOTHING;
 
 -- create random modules (max )
 INSERT INTO modules(name)
 SELECT(
   SELECT concat_ws(' ',name_first, name_last) as generated
   FROM (
     SELECT string_agg(x,'')
     FROM (
       select start_arr[ 1 + ( (random() * 25)::int) % 16 ]
       FROM
       (
           select '{CO,GE,FOR,SO,CO,GIM,SE,CO,GE,CA,FRA,GEC,GE,GA,FRO,GIP}'::text[] as start_arr
       ) syllarr,
       -- need 3 syllabes, and force generator interpretation with the '*0' (else 3 same syllabes)
       generate_series(1, 3 + (generator*0))
     ) AS comp3syl(x)
   ) AS comp_name_1st(name_first),
   (
     SELECT x[ 1 + ( (random() * 25)::int) % 14 ]
     FROM (		
       select '{Ltd,Co,SARL,SA,Gmbh,United,Brothers,Sons,International,Ext,Worldwide,Global,2000,3000}'::text[]
     ) AS z2(x)
   ) AS comp_name_last(name_last)
     )
 FROM generate_series(1,100) as generator
 -- ignore duplicates company names
 ON CONFLICT DO NOTHING;
 
 -- course_module part (max )
 INSERT INTO course_module(
 course_id,
 module_id  
 )
 SELECT
 main_sub.course_id,
 main_sub.module_id
 FROM (
 SELECT
 (select  (random() * 10)::int + (generator*0) as course_id),
 (select  (random() * 100)::int + (generator*0) as module_id),  
 generator as id
 FROM generate_series(1,100) as generator
 ) main_sub
 INNER JOIN courses ON courses.cs_id = main_sub.course_id
 INNER JOIN modules ON modules.module_id = main_sub.module_id
 ON CONFLICT DO NOTHING;
 
   -- create random questions (max )
 INSERT INTO questions(title, o1, o2, o3, o4, correct_option, explanation)
 SELECT
 (SELECT initcap(string_agg(x,''))  as name_first FROM (select start_arr[ 1 + ( (random() * 25)::int) % 31 ] FROM ( select '{ro,re,pi,co,jho,bo,ba,ja,mi,pe,da,an,en,sy,vir,nath,so,mo,aï,che,cha,dia,n,nn,hn,b,t,gh,ri,hen,ng}'::text[] as start_arr) syllarr,generate_series(1, 3 + (generator*0))) AS con_name_first(x)),
 (SELECT initcap(string_agg(x,''))  as name_first FROM (select start_arr[ 1 + ( (random() * 25)::int) % 31 ] FROM ( select '{ro,re,pi,co,jho,bo,ba,ja,mi,pe,da,an,en,sy,vir,nath,so,mo,aï,che,cha,dia,n,nn,hn,b,t,gh,ri,hen,ng}'::text[] as start_arr) syllarr,generate_series(1, 3 + (generator*0))) AS con_name_first(x)),
 (SELECT initcap(string_agg(x,''))  as name_first FROM (select start_arr[ 1 + ( (random() * 25)::int) % 31 ] FROM ( select '{ro,re,pi,co,jho,bo,ba,ja,mi,pe,da,an,en,sy,vir,nath,so,mo,aï,che,cha,dia,n,nn,hn,b,t,gh,ri,hen,ng}'::text[] as start_arr) syllarr,generate_series(1, 3 + (generator*0))) AS con_name_first(x)),
 (SELECT initcap(string_agg(x,''))  as name_first FROM (select start_arr[ 1 + ( (random() * 25)::int) % 31 ] FROM ( select '{ro,re,pi,co,jho,bo,ba,ja,mi,pe,da,an,en,sy,vir,nath,so,mo,aï,che,cha,dia,n,nn,hn,b,t,gh,ri,hen,ng}'::text[] as start_arr) syllarr,generate_series(1, 3 + (generator*0))) AS con_name_first(x)),
 (SELECT initcap(string_agg(x,''))  as name_first FROM (select start_arr[ 1 + ( (random() * 25)::int) % 31 ] FROM ( select '{ro,re,pi,co,jho,bo,ba,ja,mi,pe,da,an,en,sy,vir,nath,so,mo,aï,che,cha,dia,n,nn,hn,b,t,gh,ri,hen,ng}'::text[] as start_arr) syllarr,generate_series(1, 3 + (generator*0))) AS con_name_first(x)),
 round(random()*3)+1,
 (SELECT initcap(string_agg(x,''))  as name_first FROM (select start_arr[ 1 + ( (random() * 25)::int) % 31 ] FROM ( select '{ro,re,pi,co,jho,bo,ba,ja,mi,pe,da,an,en,sy,vir,nath,so,mo,aï,che,cha,dia,n,nn,hn,b,t,gh,ri,hen,ng}'::text[] as start_arr) syllarr,generate_series(1, 3 + (generator*0))) AS con_name_first(x))
 FROM generate_series(1,500000) as generator
 -- ignore duplicates company names
 ON CONFLICT DO NOTHING;

 -- course_module part (max )
 INSERT INTO module_question(
 module_id,
 question_id
 )
 SELECT
 main_sub.module_id,
 main_sub.question_id
 FROM (
 SELECT
 (select  (random() * 100)::int + (generator*0) as module_id),
 (select  (random() * 500000)::int + (generator*0) as question_id),  
 generator as id
 FROM generate_series(1,500000) as generator
 ) main_sub
 INNER JOIN modules ON modules.module_id = main_sub.module_id
 INNER JOIN questions ON questions.q_id = main_sub.question_id
 ON CONFLICT DO NOTHING;
  `);

  await client.query(`
  `);

  await client.query(`
  CREATE INDEX customer_student on students (customer_id);

  CREATE INDEX course_student on students (course_id);

  CREATE INDEX course_module_course on course_module (course_id);

  CREATE INDEX module_module_module on course_module (module_id);

  CREATE INDEX correct_answer on questions (correct_option);

  CREATE INDEX module_question_module on module_question (module_id);

  CREATE INDEX question_question_module on module_question (question_id);

  CREATE INDEX student_answer on answers (student_id);

  CREATE INDEX question_student_answer on answers (question_id);

  CREATE INDEX answer_student_answer on answers (answer);
  `);

  await client.release(true);
  next();
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE if exists customers cascade;
  DROP TABLE if exists students cascade;
  DROP TABLE if exists courses cascade;
  DROP TABLE if exists modules cascade;
  DROP TABLE if exists course_module cascade;
  DROP TABLE if exists questions cascade;
  DROP TABLE if exists module_question cascade;
  DROP TABLE if exists answers cascade;
  `);

  await client.release(true);
  next();
}
