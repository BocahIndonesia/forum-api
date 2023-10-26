/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

module.exports = {
  async clear () {
    await pool.query('DELETE FROM "Comment" WHERE 1=1')
  },
  async insert ({ id = 'comment-123', content = 'content example', isDelete = false, owner = 'user-123', thread = 'thread-123', date = new Date() }) {
    const comments = await pool.query({
      text: 'INSERT INTO "Comment" (id, content, is_delete, owner, thread, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, content, isDelete, owner, thread, date]
    })

    return comments.rows[0]
  },
  async selectById (id) {
    const result = await pool.query({
      text: 'SELECT * FROM "Comment" WHERE id = $1',
      values: [id]
    })

    return result.rows[0]
  }
}
