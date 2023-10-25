module.exports = class UserRepositoryInterface {
  constructor () {
    if (this.constructor.name === UserRepositoryInterface.name) {
      throw UserRepositoryInterface.ERROR.ABSTRACT_INSTATIATION
    }
  }

  static ERROR = {
    ABSTRACT_INSTATIATION: new Error('Abstract class cannot be instantiated'),
    UNIMPLEMENTED_METHOD: new Error('USER_REPOSITORY_INTERFACE.UNIMPLEMENTED_METHOD')
  }

  async register (payload) {
    throw UserRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async verifyUsernameAvailibility (username) {
    throw UserRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async getByUsername (username) {
    throw UserRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }
}
