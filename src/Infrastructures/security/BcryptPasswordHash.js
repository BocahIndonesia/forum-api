require('dotenv').config()
const PasswordHashInterface = require('../../Applications/security/PasswordHashInterface')
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError')

module.exports = class BcryptPasswordHash extends PasswordHashInterface {
  constructor (dependencies) {
    super()

    const { bcrypt } = dependencies

    this._saltHash = +process.env.SALT_HASH
    this._bcrypt = bcrypt
  }

  static ERROR = {
    INVALID_PASSWORD: new AuthenticationError('kredensial yang Anda masukkan salah')
  }

  async hash (password) {
    return await this._bcrypt.hash(password, this._saltHash)
  }

  async compare (password, encrypted) {
    const result = await this._bcrypt.compare(password, encrypted)

    if (!result) {
      throw BcryptPasswordHash.ERROR.INVALID_PASSWORD
    }
  }
}
