const pool = require('../../database/postgres/pool')
const CommentTableHelper = require('../../../../tests/CommentTableHelper')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const ThreadTableHelper = require('../../../../tests/ThreadTableHelper')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const Comment = require('../../../Domains/comments/entities/Comment')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const ArrayItemComment = require('../../../Domains/comments/entities/ArrayItemComment')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

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
      const comment = await commentRepository.add(newComment)

      // Assert
      const result = await CommentTableHelper.selectById(comment.id)
      expect(result).not.toBe(undefined)
    })

    it('It returns Comment object', async () => {
      // Action
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })

      const newComment = new NewComment({
        content: 'content example',
        thread: threadId,
        owner: commenterUser.id
      })

      const comment = await commentRepository.add(newComment)

      // Assert
      expect(comment).toBeInstanceOf(Comment)
      expect(comment).toStrictEqual(new Comment({
        id: expectedId,
        content: newComment.content,
        date: comment.date,
        isDelete: false,
        owner: newComment.owner,
        thread: newComment.thread
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
    it('It returns an array of object ArrayItemComment (the array can has 0 elements)', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uplaoder' })
      const { id: threadId } = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const comment = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })

      // Action
      const comments = await commentRepository.selectByThreadId(threadId)

      // Assert
      expect(comments).toBeInstanceOf(Array)
      expect(comments).toHaveLength(1)
      expect(comments).toContainEqual(new ArrayItemComment({
        ...comment,
        isDelete: comment.is_delete,
        username: commenterUser.username,
        replies: []
      }))
    })
  })
})
