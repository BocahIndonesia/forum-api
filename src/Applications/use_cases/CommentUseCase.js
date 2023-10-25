const CommentRepositoryInterface = require('../../Domains/comments/CommentRepositoryInterface')
const InfoComment = require('../../Domains/comments/entities/InfoComment')
const NewComment = require('../../Domains/comments/entities/NewComment')
const ThreadRepositoryInterface = require('../../Domains/threads/ThreadRepositoryInterface')
const TokenManagerInterface = require('../security/TokenManagerInterface')

module.exports = class CommentUseCase {
  constructor (dependencies) {
    const { commentRepository, threadRepository, tokenManager } = CommentUseCase.prepareDependencies(dependencies)

    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._tokenManager = tokenManager
  }

  static ERROR = {
    INVALID_COMMENT_REPOSITORY: new Error('COMMENT_USE_CASE.DOES_NOT_IMPLEMENT_COMMENT_REPOSITORY_INTERFACE'),
    INVALID_THREAD_REPOSITORY: new Error('COMMENT_USE_CASE.DOES_NOT_IMPLEMENT_THREAD_REPOSITORY_INTERFACE'),
    INVALID_TOKEN_MANAGER: new Error('COMMENT_USE_CASE.DOES_NOT_IMPLEMENT_TOKEN_MANAGER_INTERFACE')
  }

  static prepareDependencies (dependencies) {
    const { commentRepository, threadRepository, tokenManager } = dependencies

    if (!(commentRepository instanceof CommentRepositoryInterface)) throw CommentUseCase.ERROR.INVALID_COMMENT_REPOSITORY
    if (!(threadRepository instanceof ThreadRepositoryInterface)) throw CommentUseCase.ERROR.INVALID_THREAD_REPOSITORY
    if (!(tokenManager instanceof TokenManagerInterface)) throw CommentUseCase.ERROR.INVALID_TOKEN_MANAGER

    return dependencies
  }

  async add (accessToken, payload) {
    const { commentContent = undefined, threadId } = payload

    await this._threadRepository.verifyExistById(threadId)
    this._tokenManager.verifyAccessToken(accessToken)

    const { id: userId } = this._tokenManager.decodeToken(accessToken)

    const newComment = new NewComment({
      content: commentContent,
      owner: userId,
      thread: threadId
    })

    const comment = await this._commentRepository.add(newComment)

    return new InfoComment(comment)
  }

  async delete (accessToken, payload) {
    const { threadId, commentId } = payload

    await this._threadRepository.verifyExistById(threadId)
    this._tokenManager.verifyAccessToken(accessToken)

    const { id: userId } = this._tokenManager.decodeToken(accessToken)

    await this._commentRepository.verifyExistById(commentId)
    await this._commentRepository.verifyAccess({ commentId, userId })
    await this._commentRepository.softDeleteById(commentId)
  }
}
