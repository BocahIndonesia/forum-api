const NewThread = require('../../Domains/threads/entities/NewThread')
const InfoThread = require('../../Domains/threads/entities/InfoThread')
const ThreadRepositoryInterface = require('../../Domains/threads/ThreadRepositoryInterface')
const CommentRepositoryInterface = require('../../Domains/comments/CommentRepositoryInterface')
const ReplyRepositoryInterface = require('../../Domains/replies/ReplyRepositoryInterface')
const TokenManagerInterface = require('../security/TokenManagerInterface')
const ArrayItemComment = require('../../Domains/comments/entities/ArrayItemComment')
const ArrayItemReply = require('../../Domains/replies/entities/ArrayItemReply')
const DetailedThread = require('../../Domains/threads/entities/DetailedThread')

module.exports = class ThreadUseCase {
  constructor (dependencies) {
    const { threadRepository, commentRepository, replyRepository, tokenManager } = ThreadUseCase.prepareDependencies(dependencies)

    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
    this._tokenManager = tokenManager
  }

  static ERROR = {
    INVALID_THREAD_REPOSITORY: new Error('THREAD_USE_CASE.DOES_NOT_IMPLEMENT_THREAD_REPOSITORY_INTERFACE'),
    INVALID_COMMENT_REPOSITORY: new Error('THREAD_USE_CASE.DOES_NOT_IMPLEMENT_COMMENT_REPOSITORY_INTERFACE'),
    INVALID_REPLY_REPOSITORY: new Error('THREAD_USE_CASE.DOES_NOT_IMPLEMENT_REPLY_REPOSITORY_INTERFACE'),
    INVALID_TOKEN_MANAGER: new Error('THREAD_USE_CASE.DOES_NOT_IMPLEMENT_TOKEN_MANAGER_INTERFACE')
  }

  static prepareDependencies (dependencies) {
    const { threadRepository, commentRepository, replyRepository, tokenManager } = dependencies

    if (!(threadRepository instanceof ThreadRepositoryInterface)) throw ThreadUseCase.ERROR.INVALID_THREAD_REPOSITORY
    if (!(commentRepository instanceof CommentRepositoryInterface)) throw ThreadUseCase.ERROR.INVALID_COMMENT_REPOSITORY
    if (!(replyRepository instanceof ReplyRepositoryInterface)) throw ThreadUseCase.ERROR.INVALID_REPLY_REPOSITORY
    if (!(tokenManager instanceof TokenManagerInterface)) throw ThreadUseCase.ERROR.INVALID_TOKEN_MANAGER

    return dependencies
  }

  async add (accessToken, payload) {
    const { threadTitle = undefined, threadBody = undefined } = payload

    this._tokenManager.verifyAccessToken(accessToken)

    const { id: userId } = this._tokenManager.decodeToken(accessToken)
    const newThread = new NewThread({
      title: threadTitle,
      body: threadBody,
      owner: userId
    })

    const thread = await this._threadRepository.add(newThread)

    return new InfoThread(thread)
  }

  async getDetailedById (payload) {
    const { threadId } = payload

    await this._threadRepository.verifyExistById(threadId)
    const detailedThread = await this._threadRepository.getDetailedById(threadId)
    const listComment = await this._commentRepository.selectByThreadId(threadId)
    const comments = []

    for (const comment of listComment) {
      const replies = await this._replyRepository.selectByCommentId(comment.id)

      comments.push(new ArrayItemComment({
        ...comment,
        isDelete: comment.is_delete,
        replies: replies.map(reply => new ArrayItemReply({ ...reply, isDelete: reply.is_delete }))
      }))
    }

    return new DetailedThread({
      ...detailedThread,
      comments
    })
  }
}
