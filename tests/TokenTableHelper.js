/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

module.exports = {
  async clear () {
    await pool.query('DELETE FROM "Token" WHERE 1=1')
  },
  async insert (token) {
    const tokens = await pool.query({
      text: 'INSERT INTO "Token" VALUES ($1) RETURNING *',
      values: [token]
    })

    return tokens.rows[0]
  },
  async selectByToken (token) {
    const result = await pool.query({
      text: 'SELECT * FROM "Token" WHERE token = $1',
      values: [token]
    })

    return result.rows[0]
  }
}
