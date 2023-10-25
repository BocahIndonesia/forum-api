const ThreadUseCase = require('../ThreadUseCase')
const ThreadRepositoryInterface = require('../../../Domains/threads/ThreadRepositoryInterface')
const CommentRepositoryInterface = require('../../../Domains/comments/CommentRepositoryInterface')
const ReplyRepositoryInterface = require('../../../Domains/replies/ReplyRepositoryInterface')
const TokenManagerInterface = require('../../security/TokenManagerInterface')
const Thread = require('../../../Domains/threads/entities/Thread')
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
      const accessToken = 'access-token'
      const payload = {
        threadTitle: 'title example',
        threadBody: 'body example'
      }
      const expectedNewThread = new NewThread({
        title: payload.threadTitle,
        body: payload.threadBody,
        owner: 'user-123'
      })
      const expectedThread = new Thread({
        id: 'thread-123',
        title: expectedNewThread.title,
        body: expectedNewThread.body,
        date: new Date(),
        owner: 'user-123'
      })
      const expectedInfoThread = new InfoThread({
        id: expectedThread.id,
        title: expectedThread.title,
        owner: expectedNewThread.owner
      })

      mockTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => true)
      mockTokenManager.decodeToken = jest.fn().mockImplementation(() => ({ id: expectedNewThread.owner }))
      mockThreadRepository.add = jest.fn().mockImplementation(() => Promise.resolve(expectedThread))

      // Action
      const infoThread = await threadUseCase.add(accessToken, payload)

      // Assert
      expect(mockTokenManager.verifyAccessToken).toBeCalledWith(accessToken)
      expect(mockTokenManager.decodeToken).toBeCalledWith(accessToken)
      expect(mockThreadRepository.add).toBeCalledWith(expectedNewThread)
      expect(infoThread).toStrictEqual(expectedInfoThread)
    })
  })

  describe('getDetailedById', () => {
    it('It needs to orchestrate getDetailedById thread correctly', async () => {
      // Arrange
      const payload = {
        threadId: 'thread-123'
      }
      const expectedDetailedThread = new DetailedThread({
        id: payload.threadId,
        title: 'title example',
        body: 'body example',
        date: new Date(),
        username: 'user123'
      })
      const expectedArrayItemReply = new ArrayItemReply({
        id: 'reply-123',
        content: 'content example',
        username: 'user123',
        date: new Date(),
        isDelete: false
      })
      const expectedArrayItemComment = new ArrayItemComment({
        id: 'comment-123',
        content: 'content example',
        username: 'user222',
        date: new Date(),
        isDelete: false,
        replies: [expectedArrayItemReply]
      })

      mockThreadRepository.verifyExistById = jest.fn().mockImplementation(() => Promise.resolve())
      mockThreadRepository.getDetailedById = jest.fn().mockImplementation(() => Promise.resolve(expectedDetailedThread))
      mockCommentRepository.selectByThreadId = jest.fn().mockImplementation(() => Promise.resolve([expectedArrayItemComment]))
      mockReplyRepository.selectByCommentId = jest.fn().mockImplementation(() => Promise.resolve([expectedArrayItemReply]))

      // Action
      const detailThread = await threadUseCase.getDetailedById(payload)

      // Assert
      expect(mockThreadRepository.verifyExistById).toBeCalledWith(payload.threadId)
      expect(mockThreadRepository.getDetailedById).toBeCalledWith(payload.threadId)
      expect(mockCommentRepository.selectByThreadId).toBeCalledWith(payload.threadId)
      expect(mockReplyRepository.selectByCommentId).toHaveBeenCalled()
      expect(detailThread).toEqual({
        ...expectedDetailedThread,
        comments: [expectedArrayItemComment]
      })
    })
  })
})
