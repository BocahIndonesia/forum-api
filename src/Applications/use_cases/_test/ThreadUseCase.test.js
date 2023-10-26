const ThreadUseCase = require('../ThreadUseCase')
const ThreadRepositoryInterface = require('../../../Domains/threads/ThreadRepositoryInterface')
const CommentRepositoryInterface = require('../../../Domains/comments/CommentRepositoryInterface')
const ReplyRepositoryInterface = require('../../../Domains/replies/ReplyRepositoryInterface')
const TokenManagerInterface = require('../../security/TokenManagerInterface')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const InfoThread = require('../../../Domains/threads/entities/InfoThread')
const DetailedThread = require('../../../Domains/threads/entities/DetailedThread')
const ArrayItemReply = require('../../../Domains/replies/entities/ArrayItemReply')
const ArrayItemComment = require('../../../Domains/comments/entities/ArrayItemComment')

describe('ThreadUseCase', () => {
  // Arrange
  class MockThreadRepository extends ThreadRepositoryInterface {}
  const mockThreadRepository = new MockThreadRepository()

  class MockCommentRepository extends CommentRepositoryInterface {}
  const mockCommentRepository = new MockCommentRepository()

  class MockReplyRepository extends ReplyRepositoryInterface {}
  const mockReplyRepository = new MockReplyRepository()

  class MockTokenManager extends TokenManagerInterface {}
  const mockTokenManager = new MockTokenManager()

  const threadUseCase = new ThreadUseCase({
    threadRepository: mockThreadRepository,
    replyRepository: mockReplyRepository,
    commentRepository: mockCommentRepository,
    tokenManager: mockTokenManager
  })

  describe('Instantiation throws an Error if the one of the dependencies does not implement the interface', () => {
    // Arrange
    let dependencies

    beforeEach(() => {
      dependencies = {
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        threadRepository: mockThreadRepository,
        tokenManager: mockTokenManager
      }
    })

    it('It throws an error if commentRepository does not implement CommentRepositoryInterface', () => {
      // Arrange
      dependencies.commentRepository = {}

      // Action & Assert
      expect(() => new ThreadUseCase(dependencies)).toThrowError(ThreadUseCase.ERROR.INVALID_COMMENT_REPOSITORY)
    })

    it('It throws an error if threadRepository does not implement ThreadRepositoryInterface', () => {
      // Arrange
      dependencies.threadRepository = {}

      // Action & Assert
      expect(() => new ThreadUseCase(dependencies)).toThrowError(ThreadUseCase.ERROR.INVALID_THREAD_REPOSITORY)
    })

    it('It throws an error if replyRepository does not implement ReplyRepositoryInterface', () => {
      // Arrange
      dependencies.replyRepository = {}

      // Action & Assert
      expect(() => new ThreadUseCase(dependencies)).toThrowError(ThreadUseCase.ERROR.INVALID_REPLY_REPOSITORY)
    })

    it('It throws an error if tokenManager does not implement TokenManagerInterface', () => {
      // Arrange
      dependencies.tokenManager = {}

      // Action & Assert
      expect(() => new ThreadUseCase(dependencies)).toThrowError(ThreadUseCase.ERROR.INVALID_TOKEN_MANAGER)
    })
  })

  describe('add', () => {
    it('It needs to orchestrate add thread correctly', async () => {
      // Arrange
      const today = new Date()
      const accessToken = 'access-token'
      const payload = {
        threadTitle: 'title example',
        threadBody: 'body example'
      }
      const expectedNewThread = new NewThread({
        title: 'title example',
        body: 'body example',
        owner: 'user-123'
      })

      mockTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => true)
      mockTokenManager.decodeToken = jest.fn().mockImplementation(() => ({ id: 'user-123' }))
      mockThreadRepository.add = jest.fn().mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'title example',
        body: 'body example',
        owner: 'user-123',
        date: today
      }))

      // Action
      const infoThread = await threadUseCase.add(accessToken, payload)

      // Assert
      expect(mockTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
      expect(mockTokenManager.decodeToken).toBeCalledWith(accessToken)
      expect(mockThreadRepository.add).toBeCalledWith(expectedNewThread)
      expect(infoThread).toStrictEqual(new InfoThread({
        id: 'thread-123',
        title: 'title example',
        owner: 'user-123'
      }))
    })
  })

  describe('getDetailedById', () => {
    it('It needs to orchestrate getDetailedById thread correctly', async () => {
      // Arrange
      const today = new Date()
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const payload = { threadId }
      const expectedDetailedThread = new DetailedThread({
        id: threadId,
        title: 'title example',
        body: 'body example',
        date: today,
        username: 'uploader',
        comments: [new ArrayItemComment({
          id: commentId,
          content: 'comment example',
          username: 'commenter',
          date: today,
          isDelete: false,
          replies: [new ArrayItemReply({
            id: 'reply-123',
            content: 'reply example',
            username: 'replier',
            date: today,
            isDelete: false
          })]
        })]
      })

      mockThreadRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockThreadRepository.getDetailedById = jest.fn().mockImplementation(() => Promise.resolve({
        id: threadId,
        title: 'title example',
        body: 'body example',
        date: today,
        username: 'uploader'
      }))
      mockCommentRepository.selectByThreadId = jest.fn().mockImplementation(() => Promise.resolve([{
        id: commentId,
        content: 'comment example',
        username: 'commenter',
        thread: threadId,
        date: today,
        is_delete: false
      }]))
      mockReplyRepository.selectByCommentId = jest.fn().mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        content: 'reply example',
        username: 'replier',
        comment: commentId,
        date: today,
        is_delete: false
      }]))

      // Action
      const detailedThread = await threadUseCase.getDetailedById(payload)

      // Assert
      expect(mockThreadRepository.verifyExistById).toBeCalledWith(threadId)
      expect(mockThreadRepository.getDetailedById).toBeCalledWith(threadId)
      expect(mockCommentRepository.selectByThreadId).toBeCalledWith(threadId)
      expect(mockReplyRepository.selectByCommentId).toBeCalledWith(commentId)
      expect(detailedThread).toStrictEqual(expectedDetailedThread)
    })
  })
})
