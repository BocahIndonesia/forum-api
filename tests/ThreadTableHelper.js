/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

module.exports = {
  async clear () {
    await pool.query('DELETE FROM "Thread" WHERE 1=1')
  },
  async insert ({ id = 'thread-123', title = 'title example', body = 'body example', owner = 'user-123', date = new Date() }) {
    const threads = await pool.query({
      text: 'INSERT INTO "Thread" (id, title, body, owner, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [id, title, body, owner, date]
    })

    return threads.rows[0]
  },
  async selectById (id) {
    const result = await pool.query({
      text: 'SELECT * FROM "Thread" WHERE id = $1',
      values: [id]
    })

    return result.rows[0]
  }
}
