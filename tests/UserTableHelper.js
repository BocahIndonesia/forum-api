/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

module.exports = {
  async clear () {
    await pool.query('DELETE FROM "User" WHERE 1=1')
  },
  async insert ({ id = 'user-123', fullname = 'user test', username = 'user123', password = 'supersecret' }) {
    const users = await pool.query({
      text: 'INSERT INTO "User" (id, fullname, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [id, fullname, username, password]
    })

    return users.rows[0]
  },
  async selectAll () {
    return await pool.query('SELECT * FROM "User"')
  },
  async selectById (id) {
    const result = await pool.query({
      text: 'SELECT * FROM "User" WHERE id = $1',
      values: [id]
    })
    return result.rows[0]
  },
  async deleteByUsername (username) {
    await pool.query({
      text: 'DELETE FROM "User" WHERE username = $1',
      values: [username]
    })
  }
}
