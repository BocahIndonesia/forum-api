const pool = require('../../database/postgres/pool')
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const ThreadTableHelper = require('../../../../tests/ThreadTableHelper')
const CommentTableHelper = require('../../../../tests/CommentTableHelper')
const LikeTableHelper = require('../../../../tests/LikeTableHelper')
const Like = require('../../../Domains/likes/entities/Like')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('LikeRepositoryPostgres', () => {
  // Arrange & Set-up
  const threadId = 'thread-123'
  const commentId = 'comment-123'
  const likerUserId = 'user-liker-1'
  const likeRepository = new LikeRepositoryPostgres({ pool })

  beforeAll(async () => {
    const uploaderUserId = 'user-1'
    const commenterUserId = 'user-2'

    await UserTableHelper.insert({ id: uploaderUserId, username: 'uploader' })
    await UserTableHelper.insert({ id: commenterUserId, username: 'commenter' })
    await UserTableHelper.insert({ id: likerUserId, username: 'liker' })
    await ThreadTableHelper.insert({ id: threadId, owner: uploaderUserId })
    await CommentTableHelper.insert({ id: commentId, thread: threadId, owner: commenterUserId })
  })

  afterAll(async () => {
    await UserTableHelper.clear()
    await ThreadTableHelper.clear()
    await CommentTableHelper.clear()
    await pool.end()
  })

  afterEach(async () => {
    await LikeTableHelper.clear()
  })

  describe('add', () => {
    it('It persists like in the database', async () => {
      // Arrange
      const like = new Like({ comment: commentId, owner: likerUserId })

      // Action
      await likeRepository.add(like)

      // Assert
      const result = await LikeTableHelper.select(like)
      expect(result).not.toBe(undefined)
    })
  })

  describe('delete', () => {
    it('Like get removed successfully', async () => {
      // Arrange
      const like = new Like({ comment: commentId, owner: likerUserId })

      await LikeTableHelper.insert(like)

      // Action
      await likeRepository.delete(like)

      // Assert
      const result = await LikeTableHelper.select(like)
      expect(result).toBe(undefined)
    })
  })

  describe('verifyExist', () => {
    it('It throws a NotFoundError if a comment does not have a like from a user', async () => {
      // Arrange
      const like = new Like({ comment: commentId, owner: 'doesnotexist' })

      // Action & Assert
      await expect(likeRepository.verifyExist(like)).rejects.toThrowError(NotFoundError)
    })

    it('It does not throw an Error if a comment have a like from a user', async () => {
      // Arrange
      const like = new Like({ comment: commentId, owner: likerUserId })

      await LikeTableHelper.insert(like)

      // Action & Assert
      await expect(likeRepository.verifyExist(like)).resolves.toBe()
    })
  })

  describe('selectByCommentId', () => {
    it('It returns an array of object', async () => {
      // Arrange
      const likerUserId2 = 'user-liker-2'
      const like = new Like({ comment: commentId, owner: likerUserId })
      const like2 = new Like({ comment: commentId, owner: likerUserId2 })

      await UserTableHelper.insert({ id: likerUserId2, username: 'liker2' })
      await LikeTableHelper.insert(like)
      await LikeTableHelper.insert(like2)

      // Action
      const result = await likeRepository.selectByCommentId(commentId)

      // Assert
      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(2)

      // Clean-up
      await UserTableHelper.deleteById(likerUserId2)
    })
  })
})
