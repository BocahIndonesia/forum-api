const ReplyUseCase = require('../../../Applications/use_cases/ReplyUseCase')
const ReplyRepositoryInterface = require('../../../Domains/replies/ReplyRepositoryInterface')
const CommentRepositoryInterface = require('../../../Domains/comments/CommentRepositoryInterface')
const ThreadRepositoryInterface = require('../../../Domains/threads/ThreadRepositoryInterface')
const TokenManagerInterface = require('../../security/TokenManagerInterface')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const InfoReply = require('../../../Domains/replies/entities/InfoReply')

describe('ReplyUseCase', () => {
  // Arrange
  class MockReplyRepository extends ReplyRepositoryInterface {}
  const mockReplyRepository = new MockReplyRepository()

  class MockCommentRepository extends CommentRepositoryInterface {}
  const mockCommentRepository = new MockCommentRepository()

  class MockThreadRepository extends ThreadRepositoryInterface {}
  const mockThreadRepository = new MockThreadRepository()

  class MockTokenManager extends TokenManagerInterface {}
  const mockTokenManager = new MockTokenManager()

  const replyUseCase = new ReplyUseCase({
    replyRepository: mockReplyRepository,
    commentRepository: mockCommentRepository,
    threadRepository: mockThreadRepository,
    tokenManager: mockTokenManager
  })

  describe('Instantiation throws an Error if the one of the dependencies does not implement the interface', () => {
    // Arrange
    let dependencies

    beforeEach(() => {
      dependencies = {
        replyRepository: mockReplyRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        tokenManager: mockTokenManager
      }
    })

    it('It throws an error if replyRepository does not implement ReplyRepositoryInterface', () => {
      // Arrange
      dependencies.replyRepository = {}

      // Action & Assert
      expect(() => new ReplyUseCase(dependencies)).toThrowError(ReplyUseCase.ERROR.INVALID_REPLY_REPOSITORY)
    })

    it('It throws an error if commentRepository does not implement CommentRepositoryInterface', () => {
      // Arrange
      dependencies.commentRepository = {}

      // Action & Assert
      expect(() => new ReplyUseCase(dependencies)).toThrowError(ReplyUseCase.ERROR.INVALID_COMMENT_REPOSITORY)
    })

    it('It throws an error if threadRepository does not implement ThreadRepositoryInterface', () => {
      // Arrange
      dependencies.threadRepository = {}

      // Action & Assert
      expect(() => new ReplyUseCase(dependencies)).toThrowError(ReplyUseCase.ERROR.INVALID_THREAD_REPOSITORY)
    })

    it('It throws an error if tokenManager does not implement TokenManagerInterface', () => {
      // Arrange
      dependencies.tokenManager = {}

      // Action & Assert
      expect(() => new ReplyUseCase(dependencies)).toThrowError(ReplyUseCase.ERROR.INVALID_TOKEN_MANAGER)
    })
  })

  describe('add', () => {
    it('It needs to orchestrate add comment correctly', async () => {
      // Arrange
      const today = new Date()
      const accessToken = 'access-token'
      const payload = {
        replyContent: 'reply example',
        threadId: 'thread-123',
        commentId: 'comment-123'
      }
      const expectedNewReply = new NewReply({
        content: 'reply example',
        owner: 'user-123',
        comment: 'comment-123'
      })
      const expectedInfoReply = new InfoReply({
        id: 'reply-123',
        content: 'reply example',
        owner: 'user-123'
      })

      mockThreadRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockCommentRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockReplyRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => true)
      mockTokenManager.decodeToken = jest.fn().mockImplementation(() => ({ id: 'user-123', username: 'user123' }))
      mockReplyRepository.add = jest.fn().mockImplementation(() => Promise.resolve({
        id: 'reply-123',
        owner: 'user-123',
        content: 'reply example',
        comment: 'comment-123',
        date: today,
        is_delete: false
      }))

      // Action
      const infoComment = await replyUseCase.add(accessToken, payload)

      // Assert
      expect(mockThreadRepository.verifyExistById).toBeCalledWith(payload.threadId)
      expect(mockTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
      expect(mockTokenManager.decodeToken).toBeCalledWith(accessToken)
      expect(mockReplyRepository.add).toBeCalledWith(expectedNewReply)
      expect(infoComment).toStrictEqual(expectedInfoReply)
    })
  })

  describe('delete', () => {
    it('It needs to orchestrate add comment correctly', async () => {
      // Arrange
      const accessToken = 'access-token'
      const payload = {
        replyId: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123'
      }

      mockThreadRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockCommentRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockReplyRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => true)
      mockTokenManager.decodeToken = jest.fn().mockImplementation(() => ({ id: 'user-123' }))
      mockReplyRepository.verifyAccess = jest.fn().mockImplementation(() => Promise.resolve())
      mockReplyRepository.softDeleteById = jest.fn().mockImplementation(() => Promise.resolve())

      // Action
      await replyUseCase.delete(accessToken, payload)

      // Assert
      expect(mockThreadRepository.verifyExistById).toBeCalledWith(payload.threadId)
      expect(mockCommentRepository.verifyExistById).toBeCalledWith(payload.commentId)
      expect(mockTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
      expect(mockTokenManager.decodeToken).toBeCalledWith(accessToken)
      expect(mockReplyRepository.verifyExistById).toBeCalledWith(payload.replyId)
      expect(mockReplyRepository.verifyAccess).toBeCalledWith({ replyId: payload.replyId, userId: 'user-123' })
      expect(mockReplyRepository.softDeleteById).toBeCalledWith(payload.replyId)
    })
  })
})
