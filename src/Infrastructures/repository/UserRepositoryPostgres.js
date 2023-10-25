const UserRepositoryInterface = require('../../Domains/users/UserRepositoryInterface')
const InvariantError = require('../../Commons/exceptions/InvariantError')
const User = require('../../Domains/users/entities/User')

module.exports = class UserRepositoryPostgres extends UserRepositoryInterface {
  constructor (dependencies) {
    super()

    const { pool, idGenerator } = dependencies

    this._pool = pool
    this._idGenerator = idGenerator
  }

  static ERROR = {
    USERNAME_NOT_AVAILABLE: new InvariantError('username tidak tersedia'),
    USER_NOT_FOUND: new InvariantError('user tidak ditemukan')
  }

  async register (userRegistration) {
    const id = `user-${this._idGenerator()}`
    const { username, fullname, password } = userRegistration
    const users = await this._pool.query({
      text: 'INSERT INTO "User" (id, username, fullname, password) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [id, username, fullname, password]
    })

    return new User(users.rows[0])
  }

  async verifyUsernameAvailibility (username) {
    const users = await this._pool.query({
      text: 'SELECT id FROM "User" WHERE username = $1',
      values: [username]
    })

    if (users.rowCount) throw UserRepositoryPostgres.ERROR.USERNAME_NOT_AVAILABLE
  }

  async getByUsername (username) {
    const users = await this._pool.query({
      text: 'SELECT id, fullname, username, password FROM "User" WHERE username = $1',
      values: [username]
    })

    if (!users.rowCount) throw UserRepositoryPostgres.ERROR.USER_NOT_FOUND

    return new User(users.rows[0])
  }
}
