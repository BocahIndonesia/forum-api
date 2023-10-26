const pool = require('../../database/postgres/pool')
const CommentTableHelper = require('../../../../tests/CommentTableHelper')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const ThreadTableHelper = require('../../../../tests/ThreadTableHelper')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const { expect } = require('@jest/globals')

describe('CommentRepositoryPostgres', () => {
  // Arrange
  function stubIdGenerator () {
    return '123'
  }
  const expectedId = `comment-${stubIdGenerator()}`
  const commentRepository = new CommentRepositoryPostgres({ pool, idGenerator: stubIdGenerator })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserTableHelper.clear()
    await ThreadTableHelper.clear()
    await CommentTableHelper.clear()
  })

  describe('add', () => {
    it('It persists comment in the database', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })

      const newComment = new NewComment({
        content: 'content example',
        thread: threadId,
        owner: commenterUser.id
      })

      // Action
      await commentRepository.add(newComment)

      // Assert
      const result = await CommentTableHelper.selectById(expectedId)
      expect(result).not.toBe(undefined)
    })
  })

  describe('softDeleteById', () => {
    it('It changes "is_delete" to true', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })

      // Action
      await commentRepository.softDeleteById(commentId)

      // Arrange
      const comment = await CommentTableHelper.selectById(commentId)

      expect(comment.is_delete).toBe(true)
    })
  })

  describe('verifyExistById', () => {
    it('It throws a NotFoundError if the comment does not exist in database', async () => {
      // Action & Assert
      await expect(commentRepository.verifyExistById('doesnotexist')).rejects.toThrowError(NotFoundError)
    })

    it('It does not throw an Error if the comment exists in the database', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })

      // Action & Assert
      await expect(commentRepository.verifyExistById(commentId)).resolves.toBe()
    })
  })

  describe('verifyAccess', () => {
    it('It does not throw any Error if the user has the rights to the comment', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })

      // Action & Assert
      await expect(commentRepository.verifyAccess({ commentId, userId: commenterUser.id })).resolves.toBe()
    })

    it('It throws an AuthorizationError if the user does not have rights to the comment', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })

      // Action & Assert
      await expect(commentRepository.verifyAccess({ commentId, userId: 'user-unauthorized' })).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('selectByThreadId', () => {
    it('It returns an array of object sorted by its date', async () => {
      // Arrange
      const today = new Date()
      const yesterday = new Date(new Date().setDate(today.getDate() - 1))
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser1 = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const commenterUser2 = await UserTableHelper.insert({ id: 'user-3', username: 'commenter2' })
      const yesterdayComment = {
        id: 'comment-1',
        owner: commenterUser1.id,
        content: 'yesterday comment',
        thread: threadId,
        date: yesterday
      }
      const todayComment = {
        id: 'comment-2',
        owner: commenterUser2.id,
        content: 'yesterday comment',
        thread: threadId,
        date: today
      }

      await CommentTableHelper.insert(yesterdayComment)
      await CommentTableHelper.insert(todayComment)

      // Action
      const comments = await commentRepository.selectByThreadId(threadId)

      // Assert
      expect(comments).toBeInstanceOf(Array)
      expect(comments).toHaveLength(2)
      expect(comments[0].date <= comments[1].date).toBe(true)
      expect(comments[0].id).toBe(yesterdayComment.id)
      expect(comments[0].date).toEqual(yesterdayComment.date)
      expect(comments[0].content).toBe(yesterdayComment.content)
      expect(comments[0].username).toBe(commenterUser1.username)
      expect(comments[1].id).toBe(todayComment.id)
      expect(comments[1].date).toEqual(todayComment.date)
      expect(comments[1].content).toBe(todayComment.content)
      expect(comments[1].username).toBe(commenterUser2.username)
    })
  })
})
