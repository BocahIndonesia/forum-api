const RefreshToken = require('../../Domains/authentications/entities/RefreshToken')
const TokenRepositoryInterface = require('../../Domains/authentications/TokenRepositoryInterface')
const InvariantError = require('../../Commons/exceptions/InvariantError')

module.exports = class TokenRepositoryPostgres extends TokenRepositoryInterface {
  constructor (dependencies) {
    super()

    const { pool } = dependencies

    this._pool = pool
  }

  static ERROR = {
    TOKEN_NOT_FOUND: new InvariantError('refresh token tidak ditemukan di database')
  }

  async add (token) {
    const result = await this._pool.query({
      text: 'INSERT INTO "Token" VALUES($1) RETURNING *',
      values: [token]
    })

    return new RefreshToken({ ...result.rows[0] })
  }

  async delete (token) {
    await this._pool.query({
      text: 'DELETE FROM "Token" WHERE token = $1',
      values: [token]
    })
  }

  async verifyExistByToken (token) {
    const tokens = await this._pool.query({
      text: 'SELECT * FROM "Token" WHERE token = $1',
      values: [token]
    })

    if (!tokens.rowCount) throw TokenRepositoryPostgres.ERROR.TOKEN_NOT_FOUND
  }
}
