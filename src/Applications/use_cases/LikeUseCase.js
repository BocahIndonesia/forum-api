const LikeRepositoryInteface = require('../../Domains/likes/LikeRepositoryInterface')
const CommentRepositoryInterface = require('../../Domains/comments/CommentRepositoryInterface')
const ThreadRepositoryInterface = require('../../Domains/threads/ThreadRepositoryInterface')
const TokenManagerInterface = require('../security/TokenManagerInterface')
const Like = require('../../Domains/likes/entities/Like')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

module.exports = class LikeUseCase {
  constructor (dependencies) {
    const { likeRepository, commentRepository, threadRepository, tokenManager } = LikeUseCase.prepareDependencies(dependencies)

    this._likeRepository = likeRepository
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._tokenManager = tokenManager
  }

  static ERROR = {
    INVALID_LIKE_REPOSITORY: new Error('LIKE_USE_CASE.DOES_NOT_IMPLEMENT_LIKE_REPOSITORY_INTERFACE'),
    INVALID_COMMENT_REPOSITORY: new Error('LIKE_USE_CASE.DOES_NOT_IMPLEMENT_COMMENT_REPOSITORY_INTERFACE'),
    INVALID_THREAD_REPOSITORY: new Error('LIKE_USE_CASE.DOES_NOT_IMPLEMENT_THREAD_REPOSITORY_INTERFACE'),
    INVALID_TOKEN_MANAGER: new Error('LIKE_USE_CASE.DOES_NOT_IMPLEMENT_TOKEN_MANAGER_INTERFACE')
  }

  static prepareDependencies (dependencies) {
    const { likeRepository, commentRepository, threadRepository, tokenManager } = dependencies

    if (!(likeRepository instanceof LikeRepositoryInteface)) throw LikeUseCase.ERROR.INVALID_LIKE_REPOSITORY
    if (!(commentRepository instanceof CommentRepositoryInterface)) throw LikeUseCase.ERROR.INVALID_COMMENT_REPOSITORY
    if (!(threadRepository instanceof ThreadRepositoryInterface)) throw LikeUseCase.ERROR.INVALID_THREAD_REPOSITORY
    if (!(tokenManager instanceof TokenManagerInterface)) throw LikeUseCase.ERROR.INVALID_TOKEN_MANAGER

    return dependencies
  }

  async toggle (accessToken, payload) {
    const { threadId, commentId } = payload

    await this._threadRepository.verifyExistById(threadId)
    await this._commentRepository.verifyExistById(commentId)
    this._tokenManager.verifyAccessToken(accessToken)

    const { id: userId } = this._tokenManager.decodeToken(accessToken)
    const like = new Like({
      comment: commentId,
      owner: userId
    })

    try {
      await this._likeRepository.verifyExist(like)
      await this._likeRepository.delete(like)
    } catch (e) {
      if (e instanceof NotFoundError) {
        await this._likeRepository.add(like)
      } else {
        throw e
      }
    }
  }
}
