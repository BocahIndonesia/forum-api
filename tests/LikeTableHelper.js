/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

module.exports = {
  async clear () {
    await pool.query('DELETE FROM "Like" WHERE 1=1')
  },
  async insert ({ comment = 'comment-123', owner = 'user-123' }) {
    const likes = await pool.query({
      text: 'INSERT INTO "Like" (comment, owner) VALUES ($1, $2) RETURNING *',
      values: [comment, owner]
    })

    return likes.rows[0]
  },
  async select ({ comment = 'comment-123', owner = 'user-123' }) {
    const likes = await pool.query({
      text: 'SELECT * FROM "Like" WHERE comment = $1 AND owner = $2',
      values: [comment, owner]
    })

    return likes.rows[0]
  }
}
