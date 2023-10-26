/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

module.exports = {
  async clear () {
    await pool.query('DELETE FROM "Reply" WHERE 1=1')
  },
  async insert ({ id = 'reply-123', content = 'content example', isDelete = true, owner = 'user-123', comment = 'comment-123', date = new Date() }) {
    const replies = await pool.query({
      text: 'INSERT INTO "Reply" (id, content, is_delete, owner, comment, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, content, isDelete, owner, comment, date]
    })

    return replies.rows[0]
  },
  async selectById (id) {
    const result = await pool.query({
      text: 'SELECT * FROM "Reply" WHERE id = $1',
      values: [id]
    })

    return result.rows[0]
  }
}
