module.exports = class ReplyRepositoryInterface {
  constructor () {
    if (this.constructor.name === ReplyRepositoryInterface.name) {
      throw ReplyRepositoryInterface.ERROR.ABSTRACT_INSTATIATION
    }
  }

  static ERROR = {
    ABSTRACT_INSTATIATION: new Error('Abstract class cannot be instantiated'),
    UNIMPLEMENTED_METHOD: new Error('COMMENT_REPOSITORY_INTERFACE.UNIMPLEMENTED_METHOD')
  }

  async add (payload) {
    throw ReplyRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async softDeleteById (id) {
    throw ReplyRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async verifyExistById (id) {
    throw ReplyRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async verifyAccess ({ replyId, userId }) {
    throw ReplyRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async selectByCommentId (commentId) {
    throw ReplyRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }
}
