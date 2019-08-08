const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
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
        'pageTotal':Math.ceil(count.rows[0].count / limit) || 1
      };
      return result;
  },

  async getAllCustomers() {
  
  const result= await db.query(sql`
      SELECT * FROM customers;
     `);

    return result;
} 
};
