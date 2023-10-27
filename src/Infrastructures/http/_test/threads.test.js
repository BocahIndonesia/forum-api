const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')
const { translate } = require('../../../Commons/exceptions/DomainErrorTranslator')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const TokenTableHelper = require('../../../../tests/TokenTableHelper')
const ThreadTableHelper = require('../../../../tests/ThreadTableHelper')
const CommentTableHelper = require('../../../../tests/CommentTableHelper')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const TokenManagerInterface = require('../../../Applications/security/TokenManagerInterface')
const JwtManager = require('../../security/JwtManager')
const ArrayItemComment = require('../../../Domains/comments/entities/ArrayItemComment')

describe('threads', () => {
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

  describe('POST /threads for adding thread business', () => {
    it('It responds a 201 status code and persists thread data', async () => {
      // Arrange
      const payload = {
        title: 'title example',
        body: 'body example'
      }
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const accessToken = tokenManager.generateAccessToken({ id: uploaderUser.id })

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: '/threads',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(201)
      expect(responseJson.status).toBe('success')
      expect(responseJson.data.addedThread).toBeDefined()
      expect(responseJson.data.addedThread.id).toBeDefined()
      expect(responseJson.data.addedThread.title).toBe(payload.title)
      expect(responseJson.data.addedThread.owner).toBe(uploaderUser.id)
    })

    it('It responds a 401 status code if no authentication provided', async () => {
      // Arrange
      const expectedResponseMessage = JwtManager.ERROR.MISSING_AUTHENTICATION.message
      const payload = {
        title: 'title example',
        body: 'body example'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
      const expectedResponseMessage = translate(NewThread.ERROR.INCOMPLETE_PAYLOAD).message
      const payload = {
        title: 'title example'
      }
      const payload2 = {
        body: 'body example'
      }
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const accessToken = tokenManager.generateAccessToken({ id: uploaderUser.id })

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: '/threads',
        payload
      })
      const response2 = await server.inject({
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: '/threads',
        payload: payload2
      })
      const response3 = await server.inject({
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: '/threads'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      const responseJson2 = JSON.parse(response2.payload)
      const responseJson3 = JSON.parse(response3.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
      expect(response2.statusCode).toBe(400)
      expect(responseJson2.status).toBe('fail')
      expect(responseJson2.message).toBe(expectedResponseMessage)
      expect(response3.statusCode).toBe(400)
      expect(responseJson3.status).toBe('fail')
      expect(responseJson3.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code on wrong data type', async () => {
      // Arrange
      const expectedResponseMessage = translate(NewThread.ERROR.INVALID_TYPE).message
      const payload = {
        title: 123,
        body: 'body example'
      }
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      const accessToken = tokenManager.generateAccessToken({ id: uploaderUser.id })

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        url: '/threads',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })
  })

  describe('GET /threads/{threadId} for getting detailed thread', () => {
    it('It responds a 200 status code if the thread exists in the database', async () => {
      // Arrange
      const uploaderUser1 = await UserTableHelper.insert({ id: 'user-1', username: 'uploader1' })
      const uploaderUser2 = await UserTableHelper.insert({ id: 'user-2', username: 'uploader2' })
      const commenter1 = await UserTableHelper.insert({ id: 'user-10', username: 'commenter1' })
      const commenter2 = await UserTableHelper.insert({ id: 'user-20', username: 'commenter2' })
      const thread1 = await ThreadTableHelper.insert({ id: 'thread-1', owner: uploaderUser1.id })
      const thread2 = await ThreadTableHelper.insert({ id: 'thread-2', owner: uploaderUser2.id })
      const comment1 = await CommentTableHelper.insert({ id: 'comment-1', owner: commenter1.id, thread: thread1.id })
      const comment2 = await CommentTableHelper.insert({ id: 'comment-2', owner: commenter2.id, thread: thread1.id, isDelete: true })

      // Action
      const response1 = await server.inject({
        method: 'GET',
        url: `/threads/${thread1.id}`
      })
      const response2 = await server.inject({
        method: 'GET',
        url: `/threads/${thread2.id}`
      })

      // Assert
      const responseJson1 = JSON.parse(response1.payload)

      expect(response1.statusCode).toBe(200)
      expect(responseJson1.status).toBe('success')
      expect(responseJson1.data.thread.id).toBeDefined()
      expect(responseJson1.data.thread.title).toBe(thread1.title)
      expect(responseJson1.data.thread.body).toBe(thread1.body)
      expect(responseJson1.data.thread.date).toBe(thread1.date.toISOString())
      expect(responseJson1.data.thread.username).toBe(uploaderUser1.username)
      expect(responseJson1.data.thread.comments).toEqual([
        new ArrayItemComment({
          ...comment1,
          username: commenter1.username,
          isDelete: comment1.is_delete,
          replies: [],
          likeCount: 0
        }),
        new ArrayItemComment({
          ...comment2,
          username: commenter2.username,
          isDelete: comment2.is_delete,
          replies: [],
          likeCount: 0
        })
      ].sort(comment => comment.date))

      const responseJson2 = JSON.parse(response2.payload)

      expect(response2.statusCode).toBe(200)
      expect(responseJson2.status).toBe('success')
      expect(responseJson2.data.thread.title).toBe(thread2.title)
      expect(responseJson2.data.thread.body).toBe(thread2.body)
      expect(responseJson2.data.thread.date).toBe(thread2.date.toISOString())
      expect(responseJson2.data.thread.username).toBe(uploaderUser2.username)
    })

    it('It responds a 404 status code if the thread does not exist in the database', async () => {
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/doesnotexist'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(404)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBeDefined()
    })
  })
})
