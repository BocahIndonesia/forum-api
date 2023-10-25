module.exports = class CommentRepositoryInterface {
  constructor () {
    if (this.constructor.name === CommentRepositoryInterface.name) {
      throw CommentRepositoryInterface.ERROR.ABSTRACT_INSTATIATION
    }
  }

  static ERROR = {
    ABSTRACT_INSTATIATION: new Error('Abstract class cannot be instantiated'),
    UNIMPLEMENTED_METHOD: new Error('COMMENT_REPOSITORY_INTERFACE.UNIMPLEMENTED_METHOD')
  }

  async add (payload) {
    throw CommentRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async softDeleteById (id) {
    throw CommentRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async verifyExistById (id) {
    throw CommentRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async verifyAccess ({ commentId, userId }) {
    throw CommentRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  async selectByThreadId (threadId) {
    throw CommentRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD
  }
}
