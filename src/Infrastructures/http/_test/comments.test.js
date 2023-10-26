const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')
const { translate } = require('../../../Commons/exceptions/DomainErrorTranslator')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const TokenTableHelper = require('../../../../tests/TokenTableHelper')
const ThreadTableHelper = require('../../../../tests/ThreadTableHelper')
const CommentTableHelper = require('../../../../tests/CommentTableHelper')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const TokenManagerInterface = require('../../../Applications/security/TokenManagerInterface')
const JwtManager = require('../../security/JwtManager')

describe('comments', () => {
  let server
  const tokenManager = container.getInstance(TokenManagerInterface.name)

  beforeAll(async () => {
    server = await createServer(container)
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserTableHelper.clear()
    await TokenTableHelper.clear()
    await ThreadTableHelper.clear()
  })

  describe('POST /threads/{threadId}/comments for adding comment business', () => {
    it('It responds a 201 status code and persists comment data', async () => {
      // Arrange
      const payload = {
        content: 'content-example'
      }
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const { id: threadId } = await ThreadTableHelper.insert({ owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const accessToken = tokenManager.generateAccessToken({ id: commenterUser.id })

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: `/threads/${threadId}/comments`,
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(201)
      expect(responseJson.status).toBe('success')
      expect(responseJson.data.addedComment).toBeDefined()
      expect(responseJson.data.addedComment.id).toBeDefined()
      expect(responseJson.data.addedComment.content).toBe(payload.content)
      expect(responseJson.data.addedComment.owner).toBe(commenterUser.id)
    })

    it('It responds a 401 status code if no authentication provided', async () => {
      // Arrange
      const expectedResponseMessage = JwtManager.ERROR.MISSING_AUTHENTICATION.message
      const payload = {
        content: 'content example'
      }
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const { id: threadId } = await ThreadTableHelper.insert({ owner: uploaderUser.id })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(401)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code on incomplete payload', async () => {
      // Arrange
      const expectedResponseMessage = translate(NewComment.ERROR.INCOMPLETE_PAYLOAD).message
      const payload = {}
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const { id: threadId } = await ThreadTableHelper.insert({ owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const accessToken = tokenManager.generateAccessToken({ id: commenterUser.id })

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: `/threads/${threadId}/comments`,
        payload
      })
      const response2 = await server.inject({
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: `/threads/${threadId}/comments`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      const responseJson2 = JSON.parse(response2.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
      expect(response2.statusCode).toBe(400)
      expect(responseJson2.status).toBe('fail')
      expect(responseJson2.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code on wrong data type', async () => {
      // Arrange
      const expectedResponseMessage = translate(NewComment.ERROR.INVALID_TYPE).message
      const payload = {
        content: 123
      }
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const { id: threadId } = await ThreadTableHelper.insert({ owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const accessToken = tokenManager.generateAccessToken({ id: commenterUser.id })

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: `/threads/${threadId}/comments`,
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })
  })

  describe('DELETE /threads/{threadId}/comments/{commentId} for deleting comment business', () => {
    it('It responds a 200 status code', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const { id: threadId } = await ThreadTableHelper.insert({ owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })
      const accessToken = tokenManager.generateAccessToken({ id: commenterUser.id })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: `/threads/${threadId}/comments/${commentId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(200)
      expect(responseJson.status).toBe('success')
    })

    it('It responds a 401 status code if no authentication provided', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const { id: threadId } = await ThreadTableHelper.insert({ owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(401)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('It responds a 403 status code if not authorized', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const { id: threadId } = await ThreadTableHelper.insert({ owner: uploaderUser.id })
      const commenterUser = await UserTableHelper.insert({ id: 'user-2', username: 'commenter' })
      const { id: commentId } = await CommentTableHelper.insert({ owner: commenterUser.id, thread: threadId })
      const accessToken = tokenManager.generateAccessToken({ id: 'user-unauthorized' })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: `/threads/${threadId}/comments/${commentId}`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(403)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('It responds a 404 status code if the comment does not exist in the database', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const { id: threadId } = await ThreadTableHelper.insert({ owner: uploaderUser.id })
      const accessToken = tokenManager.generateAccessToken({ id: 'user-random' })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: `/threads/${threadId}/comments/comment-doesnotexist`
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(404)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBeDefined()
    })
  })
})
