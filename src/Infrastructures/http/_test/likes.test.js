const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const TokenTableHelper = require('../../../../tests/TokenTableHelper')
const ThreadTableHelper = require('../../../../tests/ThreadTableHelper')
const LikeTableHelper = require('../../../../tests/LikeTableHelper')
const CommentTableHelper = require('../../../../tests/CommentTableHelper')
const TokenManagerInterface = require('../../../Applications/security/TokenManagerInterface')

describe('likes', () => {
  let server
  const threadId = 'thread-123'
  const commentId = 'comment-123'
  const likerUserId = 'user-liker-1'
  const tokenManager = container.getInstance(TokenManagerInterface.name)

  beforeAll(async () => {
    const uploaderUserId = 'user-1'
    const commenterUserId = 'user-2'
    server = await createServer(container)

    await UserTableHelper.insert({ id: uploaderUserId, username: 'uploader' })
    await UserTableHelper.insert({ id: commenterUserId, username: 'commenter' })
    await UserTableHelper.insert({ id: likerUserId, username: 'liker' })
    await ThreadTableHelper.insert({ id: threadId, owner: uploaderUserId })
    await CommentTableHelper.insert({ id: commentId, thread: threadId, owner: commenterUserId })
  })

  afterAll(async () => {
    await UserTableHelper.clear()
    await TokenTableHelper.clear()
    await ThreadTableHelper.clear()
    await pool.end()
  })

  afterEach(async () => {
    await LikeTableHelper.clear()
  })

  describe('PUT /threads/{threadId}/comments/likes for toggle like', () => {
    it('It responds a 200 status code and the like is saved in the database', async () => {
      // Arrange
      const payload = { threadId, commentId }
      const accessToken = tokenManager.generateAccessToken({ id: likerUserId })

      // Action
      const response = await server.inject({
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        payload
      })

      // Assert
      const result = await LikeTableHelper.select({ comment: commentId, owner: likerUserId })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(200)
      expect(responseJson.status).toBe('success')
      expect(result).not.toBe(undefined)
    })

    it('It responds a 200 status code and the like is deleted from the database', async () => {
      // Arrange
      const payload = { threadId, commentId }
      const accessToken = tokenManager.generateAccessToken({ id: likerUserId })

      await LikeTableHelper.insert({ comment: commentId, owner: likerUserId })

      // Action
      const response = await server.inject({
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        payload
      })

      // Assert
      const result = await LikeTableHelper.select({ comment: commentId, owner: likerUserId })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(200)
      expect(responseJson.status).toBe('success')
      expect(result).toBe(undefined)
    })
  })
})
