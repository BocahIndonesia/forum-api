const ReplyRepositoryInterface = require('../../Domains/replies/ReplyRepositoryInterface')
const CommentRepositoryInterface = require('../../Domains/comments/CommentRepositoryInterface')
const ThreadRepositoryInterface = require('../../Domains/threads/ThreadRepositoryInterface')
const TokenManagerInterface = require('../security/TokenManagerInterface')
const InfoReply = require('../../Domains/replies/entities/InfoReply')
const NewReply = require('../../Domains/replies/entities/NewReply')

module.exports = class ReplyUseCase {
  constructor (dependencies) {
    const { replyRepository, commentRepository, threadRepository, tokenManager } = ReplyUseCase.prepareDependencies(dependencies)

    this._replyRepository = replyRepository
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._tokenManager = tokenManager
  }

  static ERROR = {
    INVALID_REPLY_REPOSITORY: new Error('REPLY_USE_CASE.DOES_NOT_IMPLEMENT_REPLY_REPOSITORY_INTERFACE'),
    INVALID_COMMENT_REPOSITORY: new Error('REPLY_USE_CASE.DOES_NOT_IMPLEMENT_COMMENT_REPOSITORY_INTERFACE'),
    INVALID_THREAD_REPOSITORY: new Error('REPLY_USE_CASE.DOES_NOT_IMPLEMENT_THREAD_REPOSITORY_INTERFACE'),
    INVALID_TOKEN_MANAGER: new Error('REPLY_USE_CASE.DOES_NOT_IMPLEMENT_TOKEN_MANAGER_INTERFACE')
  }

  static prepareDependencies (dependencies) {
    const { replyRepository, commentRepository, threadRepository, tokenManager } = dependencies

    if (!(replyRepository instanceof ReplyRepositoryInterface)) throw ReplyUseCase.ERROR.INVALID_REPLY_REPOSITORY
    if (!(commentRepository instanceof CommentRepositoryInterface)) throw ReplyUseCase.ERROR.INVALID_COMMENT_REPOSITORY
    if (!(threadRepository instanceof ThreadRepositoryInterface)) throw ReplyUseCase.ERROR.INVALID_THREAD_REPOSITORY
    if (!(tokenManager instanceof TokenManagerInterface)) throw ReplyUseCase.ERROR.INVALID_TOKEN_MANAGER

    return dependencies
  }

  async add (accessToken, payload) {
    const { threadId, commentId, replyContent = undefined } = payload

    await this._threadRepository.verifyExistById(threadId)
    await this._commentRepository.verifyExistById(commentId)
    this._tokenManager.verifyAccessToken(accessToken)

    const { id: userId } = this._tokenManager.decodeToken(accessToken)

    const newReply = new NewReply({
      content: replyContent,
      comment: commentId,
      owner: userId
    })

    const reply = await this._replyRepository.add(newReply)

    return new InfoReply(reply)
  }

  async delete (accessToken, payload) {
    const { threadId, commentId, replyId } = payload

    await this._threadRepository.verifyExistById(threadId)
    await this._commentRepository.verifyExistById(commentId)
    this._tokenManager.verifyAccessToken(accessToken)

    const { id: userId } = this._tokenManager.decodeToken(accessToken)

    await this._replyRepository.verifyExistById(replyId)
    await this._replyRepository.verifyAccess({ replyId, userId })
    await this._replyRepository.softDeleteById(replyId)
  }
}
