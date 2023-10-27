const LikeUseCase = require('../LikeUseCase')
const CommentRepositoryInterface = require('../../../Domains/comments/CommentRepositoryInterface')
const ThreadRepositoryInterface = require('../../../Domains/threads/ThreadRepositoryInterface')
const LikeRepositoryInterface = require('../../../Domains/likes/LikeRepositoryInterface')
const TokenManagerInterface = require('../../security/TokenManagerInterface')
const Like = require('../../../Domains/likes/entities/Like')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('LikeUseCase', () => {
  // Arrange
  class MockLikeRepository extends LikeRepositoryInterface {}
  const mockLikeRepository = new MockLikeRepository()

  class MockCommentRepository extends CommentRepositoryInterface {}
  const mockCommentRepository = new MockCommentRepository()

  class MockThreadRepository extends ThreadRepositoryInterface {}
  const mockThreadRepository = new MockThreadRepository()

  class MockTokenManager extends TokenManagerInterface {}
  const mockTokenManager = new MockTokenManager()

  const likeUseCase = new LikeUseCase({
    likeRepository: mockLikeRepository,
    commentRepository: mockCommentRepository,
    threadRepository: mockThreadRepository,
    tokenManager: mockTokenManager
  })

  describe('Instantiation throws an Error if the one of the dependencies does not implement the interface', () => {
    // Arrange
    let dependencies

    beforeEach(() => {
      dependencies = {
        likeRepository: mockLikeRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        tokenManager: mockTokenManager
      }
    })

    it('It throws an error if likeRepository does not implement LikeRepositoryInteface', () => {
      // Arrange
      dependencies.likeRepository = {}

      // Action & Assert
      expect(() => new LikeUseCase(dependencies)).toThrowError(LikeUseCase.ERROR.INVALID_LIKE_REPOSITORY)
    })

    it('It throws an error if commentRepository does not implement CommentRepositoryInterface', () => {
      // Arrange
      dependencies.commentRepository = {}

      // Action & Assert
      expect(() => new LikeUseCase(dependencies)).toThrowError(LikeUseCase.ERROR.INVALID_COMMENT_REPOSITORY)
    })

    it('It throws an error if threadRepository does not implement ThreadRepositoryInterface', () => {
      // Arrange
      dependencies.threadRepository = {}

      // Action & Assert
      expect(() => new LikeUseCase(dependencies)).toThrowError(LikeUseCase.ERROR.INVALID_THREAD_REPOSITORY)
    })

    it('It throws an error if tokenManager does not implement TokenManagerInterface', () => {
      // Arrange
      dependencies.tokenManager = {}

      // Action & Assert
      expect(() => new LikeUseCase(dependencies)).toThrowError(LikeUseCase.ERROR.INVALID_TOKEN_MANAGER)
    })
  })

  describe('toggle', () => {
    describe('It needs to orchestrate toggle like correctly', () => {
      // Arrange
      const accessToken = 'access-token'
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-123'
      }
      const expectedLike = new Like({
        comment: 'comment-123',
        owner: 'user-123'
      })

      mockThreadRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockCommentRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => Promise.resolve())
      mockTokenManager.decodeToken = jest.fn().mockImplementation(() => ({ id: 'user-123', username: 'user123' }))

      it('Add like because the user has not like on that comment', async () => {
        // Arrange
        mockLikeRepository.verifyExist = jest.fn().mockImplementation(() => Promise.reject(new NotFoundError('')))
        mockLikeRepository.add = jest.fn().mockImplementation(() => Promise.resolve({
          comment: 'comment-123',
          owner: 'user-123'
        }))

        // Action
        const infoLike = await likeUseCase.toggle(accessToken, payload)

        // Assert
        expect(mockThreadRepository.verifyExistById).toBeCalledWith(payload.threadId)
        expect(mockCommentRepository.verifyExistById).toBeCalledWith(payload.commentId)
        expect(mockTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
        expect(mockTokenManager.decodeToken).toBeCalledWith(accessToken)
        expect(mockLikeRepository.verifyExist).toBeCalledWith(expectedLike)
        expect(mockLikeRepository.add).toBeCalledWith(expectedLike)
        expect(infoLike).toBe(undefined)
      })

      it('Delete like because the user has a like on that comment', async () => {
        // Arrange
        mockLikeRepository.verifyExist = jest.fn().mockImplementation(() => Promise.resolve())
        mockLikeRepository.delete = jest.fn().mockImplementation(() => Promise.resolve())

        // Action
        const infoLike = await likeUseCase.toggle(accessToken, payload)

        // Assert
        expect(mockThreadRepository.verifyExistById).toBeCalledWith(payload.threadId)
        expect(mockCommentRepository.verifyExistById).toBeCalledWith(payload.commentId)
        expect(mockTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
        expect(mockTokenManager.decodeToken).toBeCalledWith(accessToken)
        expect(mockLikeRepository.verifyExist).toBeCalledWith(expectedLike)
        expect(mockLikeRepository.delete).toBeCalledWith(expectedLike)
        expect(infoLike).toBe(undefined)
      })
    })
  })
})
