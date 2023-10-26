module.exports = class LikeRepositoryInterface {
  constructor () {
    if (this.constructor.name === LikeRepositoryInterface.name) {
      throw LikeRepositoryInterface.ERROR.ABSTRACT_INSTATIATION
    }
  }

  static ERROR = {
    ABSTRACT_INSTATIATION: new Error('Abstract class cannot be instantiated'),
    UNIMPLEMENTED_METHOD: new Error('LIKE_REPOSITORY_INTERFACE.UNIMPLEMENTED_METHOD')
  }

  async add ({ commentId, userId }) {
    throw LikeRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async delete ({ commentId, userId }) {
    throw LikeRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async verifyExist ({ commentId, userId }) {
    throw LikeRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async selectByCommentId (commentId) {
    throw LikeRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }
}
