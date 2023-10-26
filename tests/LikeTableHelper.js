/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

module.exports = {
  async clear () {
    await pool.query('DELETE FROM "Like" WHERE 1=1')
  },
  async insert ({ owner = 'user-123', comment = 'comment-123' }) {
    const replies = await pool.query({
      text: 'INSERT INTO "Like" (owner, comment) VALUES ($1, $2) RETURNING *',
      values: [owner, comment]
    })

    return replies.rows[0]
  }
}
