module.exports = class ThreadRepositoryInterface {
  constructor () {
    if (this.constructor.name === ThreadRepositoryInterface.name) {
      throw ThreadRepositoryInterface.ERROR.ABSTRACT_INSTATIATION
    }
  }

  static ERROR = {
    ABSTRACT_INSTATIATION: new Error('Abstract class cannot be instantiated'),
    UNIMPLEMENTED_METHOD: new Error('THREAD_REPOSITORY_INTERFACE.UNIMPLEMENTED_METHOD')
  }

  async add () {
    throw ThreadRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async verifyExistById (id) {
    throw ThreadRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async getDetailedById (id) {
    throw ThreadRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }
}
