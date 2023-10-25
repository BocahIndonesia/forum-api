module.exports = class TokenRepositoryInterface {
  static ERROR = {
    ABSTRACT_INSTATIATION: new Error('Abstract class cannot be instantiated'),
    UNIMPLEMENTED_METHOD: new Error('TOKEN_REPOSITORY_INTERFACE.UNIMPLEMENTED_METHOD')
  }

  constructor () {
    if (this.constructor.name === TokenRepositoryInterface.name) {
      throw TokenRepositoryInterface.ERROR.ABSTRACT_INSTATIATION
    }
  }

  async add (token) {
    throw TokenRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async delete (token) {
    throw TokenRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async verifyExistByToken (token) {
    throw TokenRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }
}
