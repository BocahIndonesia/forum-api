module.exports = class PasswordHashInterface {
  constructor () {
    if (this.constructor.name === PasswordHashInterface.name) {
      throw PasswordHashInterface.ERROR.ABSTRACT_INSTANTIATION
    }
  }

  static ERROR = {
    ABSTRACT_INSTANTIATION: new Error('Abstract class cannot be instantiated'),
    UNIMPLEMENTED_METHOD: new Error('PASSWORD_HASH.UNIMPLEMENTED_METHOD')
  }

  async hash (password) {
    throw PasswordHashInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async compare (password, encrypted) {
    throw PasswordHashInterface.ERROR.UNIMPLEMENTED_METHOD
  }
}
