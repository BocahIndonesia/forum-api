const CommentUseCase = require('../../../Applications/use_cases/CommentUseCase')
const CommentRepositoryInterface = require('../../../Domains/comments/CommentRepositoryInterface')
const ThreadRepositoryInterface = require('../../../Domains/threads/ThreadRepositoryInterface')
const TokenManagerInterface = require('../../security/TokenManagerInterface')
const Comment = require('../../../Domains/comments/entities/Comment')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const InfoComment = require('../../../Domains/comments/entities/InfoComment')

describe('CommentUseCase', () => {
  // Arrange
  class MockCommentRepository extends CommentRepositoryInterface {}
  const mockCommentRepository = new MockCommentRepository()

  class MockThreadRepository extends ThreadRepositoryInterface {}
  const mockThreadRepository = new MockThreadRepository()

  class MockTokenManager extends TokenManagerInterface {}
  const mockTokenManager = new MockTokenManager()

  const commentUseCase = new CommentUseCase({
    commentRepository: mockCommentRepository,
    threadRepository: mockThreadRepository,
    tokenManager: mockTokenManager
  })

  describe('Instantiation throws an Error if the one of the dependencies does not implement the interface', () => {
    // Arrange
    let dependencies

    beforeEach(() => {
      dependencies = {
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        tokenManager: mockTokenManager
      }
    })

    it('It throws an error if commentRepository does not implement CommentRepositoryInterface', () => {
      // Arrange
      dependencies.commentRepository = {}

      // Action & Assert
      expect(() => new CommentUseCase(dependencies)).toThrowError(CommentUseCase.ERROR.INVALID_COMMENT_REPOSITORY)
    })

    it('It throws an error if threadRepository does not implement ThreadRepositoryInterface', () => {
      // Arrange
      dependencies.threadRepository = {}

      // Action & Assert
      expect(() => new CommentUseCase(dependencies)).toThrowError(CommentUseCase.ERROR.INVALID_THREAD_REPOSITORY)
    })

    it('It throws an error if tokenManager does not implement TokenManagerInterface', () => {
      // Arrange
      dependencies.tokenManager = {}

      // Action & Assert
      expect(() => new CommentUseCase(dependencies)).toThrowError(CommentUseCase.ERROR.INVALID_TOKEN_MANAGER)
    })
  })

  describe('add', () => {
    it('It needs to orchestrate add comment correctly', async () => {
      // Arrange
      const accessToken = 'access-token'
      const payload = {
        commentContent: 'content example',
        threadId: 'thread-123'
      }
      const expectedNewComment = new NewComment({
        content: payload.commentContent,
        owner: 'user-123',
        thread: payload.threadId
      })
      const expectedComment = new Comment({
        id: 'comment-123',
        owner: expectedNewComment.owner,
        content: expectedNewComment.content,
        thread: expectedNewComment.thread,
        date: new Date(),
        isDelete: false
      })

      mockThreadRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => true)
      mockTokenManager.decodeToken = jest.fn().mockImplementation(() => ({ id: expectedNewComment.owner }))
      mockCommentRepository.add = jest.fn().mockImplementation(() => Promise.resolve(expectedComment))

      // Action
      const infoComment = await commentUseCase.add(accessToken, payload)

      // Assert
      expect(mockThreadRepository.verifyExistById).toBeCalledWith(payload.threadId)
      expect(mockTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
      expect(mockTokenManager.decodeToken).toBeCalledWith(accessToken)
      expect(mockCommentRepository.add).toBeCalledWith(expectedNewComment)
      expect(infoComment).toStrictEqual(new InfoComment({
        id: expectedComment.id,
        content: expectedComment.content,
        owner: expectedComment.owner
      }))
    })
  })

  describe('delete', () => {
    it('It needs to orchestrate add comment correctly', async () => {
      // Arrange
      const accessToken = 'access-token'
      const userId = 'user-123'
      const payload = {
        commentId: 'comment-123',
        threadId: 'thread-123'
      }

      mockThreadRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => true)
      mockTokenManager.decodeToken = jest.fn().mockImplementation(() => ({ id: userId }))
      mockCommentRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockCommentRepository.verifyAccess = jest.fn().mockImplementation(() => Promise.resolve())
      mockCommentRepository.softDeleteById = jest.fn().mockImplementation(() => Promise.resolve())

      // Action
      await commentUseCase.delete(accessToken, payload)

      // Assert
      expect(mockThreadRepository.verifyExistById).toBeCalledWith(payload.threadId)
      expect(mockTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
      expect(mockTokenManager.decodeToken).toBeCalledWith(accessToken)
      expect(mockCommentRepository.verifyExistById).toBeCalledWith(payload.commentId)
      expect(mockCommentRepository.verifyAccess).toBeCalledWith({ commentId: payload.commentId, userId })
      expect(mockCommentRepository.softDeleteById).toBeCalledWith(payload.commentId)
    })
  })
})
