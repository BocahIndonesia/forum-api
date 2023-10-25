const pool = require('../../database/postgres/pool')
const ReplyTableHelper = require('../../../../tests/ReplyTableHelper')
const CommentTableHelper = require('../../../../tests/CommentTableHelper')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const ThreadTableHelper = require('../../../../tests/ThreadTableHelper')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const Reply = require('../../../Domains/replies/entities/Reply')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const ArrayItemReply = require('../../../Domains/replies/entities/ArrayItemReply')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('ReplyRepositoryPostgres', () => {
  function stubIdGenerator () {
    return '123'
  }
  const expectedId = `reply-${stubIdGenerator()}`
  const replyRepository = new ReplyRepositoryPostgres({ pool, idGenerator: stubIdGenerator })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserTableHelper.clear()
    await ThreadTableHelper.clear()
    await CommentTableHelper.clear()
    await ReplyTableHelper.clear()
  })

  describe('add', () => {
    it('It persists reply in the database', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })
      const replierUser = await UserTableHelper.insert({ id: 'user-3', username: 'replier' })

      const newReply = new NewReply({
        content: 'content example',
        comment: commentId,
        owner: replierUser.id
      })

      // Action
      const reply = await replyRepository.add(newReply)

      // Assert
      const result = await ReplyTableHelper.selectById(reply.id)
      expect(result).not.toBe(undefined)
    })

    it('It returns Reply object', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })
      const replierUser = await UserTableHelper.insert({ id: 'user-3', username: 'replier' })

      const newReply = new NewReply({
        content: 'content example',
        comment: commentId,
        owner: replierUser.id
      })

      // Action
      const reply = await replyRepository.add(newReply)

      // Assert
      expect(reply).toBeInstanceOf(Reply)
      expect(reply).toStrictEqual(new Reply({
        id: expectedId,
        content: newReply.content,
        date: reply.date,
        isDelete: false,
        owner: newReply.owner,
        comment: newReply.comment
      }))
    })
  })

  describe('softDeleteById', () => {
    it('It changes "is_delete" to true', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })
      const replierUser = await UserTableHelper.insert({ id: 'user-3', username: 'replier' })
      const { id: replyId } = await ReplyTableHelper.insert({ owner: replierUser.id, comment: commentId })

      // Action
      await replyRepository.softDeleteById(replyId)

      // Arrange
      const reply = await ReplyTableHelper.selectById(replyId)

      expect(reply.is_delete).toBe(true)
    })
  })

  describe('verifyExistById', () => {
    it('It throws a NotFoundError if the reply does not exist in database', async () => {
      // Action & Assert
      await expect(replyRepository.verifyExistById('notexist')).rejects.toThrowError(NotFoundError)
    })

    it('It does not throw an Error if the reply exists in the database', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })
      const replierUser = await UserTableHelper.insert({ id: 'user-3', username: 'replier' })
      const { id: replyId } = await ReplyTableHelper.insert({ id: 'reply-1', owner: replierUser.id, comment: commentId })

      // Action & Assert
      await expect(replyRepository.verifyExistById(replyId)).resolves.toBe()
    })
  })

  describe('verifyAccess', () => {
    it('It does not throw any Error if the user has the rights to the reply', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })
      const replierUser = await UserTableHelper.insert({ id: 'user-3', username: 'replier' })
      const { id: replyId } = await ReplyTableHelper.insert({ owner: replierUser.id, comment: commentId })

      // Action & Assert
      await expect(replyRepository.verifyAccess({ replyId, userId: replierUser.id })).resolves.toBe()
    })

    it('It throws an AuthorizationError if the user does not have rights to the comment', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })
      const replierUser = await UserTableHelper.insert({ id: 'user-3', username: 'replier' })
      const { id: replyId } = await ReplyTableHelper.insert({ owner: replierUser.id, comment: commentId })

      // Action & Assert
      await expect(replyRepository.verifyAccess({ replyId, userId: 'user-unauthorized' })).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('selectByCommentId', () => {
    it('It returns an array of object ArrayItemReply (the array can has 0 elements)', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })
      const replierUser = await UserTableHelper.insert({ id: 'user-3', username: 'replier' })
      const reply = await ReplyTableHelper.insert({ owner: replierUser.id, comment: commentId })

      // Action
      const replies = await replyRepository.selectByCommentId(commentId)

      // Assert
      expect(replies).toBeInstanceOf(Array)
      expect(replies).toHaveLength(1)
      expect(replies).toContainEqual(new ArrayItemReply({
        ...reply,
        isDelete: reply.is_delete,
        username: replierUser.username
      }))
    })
  })
})
