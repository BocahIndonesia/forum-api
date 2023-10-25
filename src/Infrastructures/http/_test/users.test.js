const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')
const { translate } = require('../../../Commons/exceptions/DomainErrorTranslator')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const UserRegistration = require('../../../Domains/users/entities/UserRegistration')
const UserRepositoryPostgres = require('../../repository/UserRepositoryPostgres')

describe('users', () => {
  let server

  beforeAll(async () => {
    server = await createServer(container)
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserTableHelper.clear()
  })

  describe('POST /users for register business', () => {
    it('It responds a 201 status code and persists user data', async () => {
      // Arrange
      const payload = {
        fullname: 'user test',
        username: 'user123',
        password: 'supersecret'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(201)
      expect(responseJson.status).toBe('success')
      expect(responseJson.data.addedUser).toBeDefined()
      expect(responseJson.data.addedUser.id).toBeDefined()
      expect(responseJson.data.addedUser.username).toBe(payload.username)
      expect(responseJson.data.addedUser.fullname).toBe(payload.fullname)
    })

    it('It responds a 400 status code on incomplete payload', async () => {
      // Arrange
      const expectedResponseMessage = translate(UserRegistration.ERROR.INCOMPLETE_PAYLOAD).message
      const payload = {
        username: 'user123',
        password: 'supersecret'
      }
      const payload2 = {
        fullname: 'user test',
        password: 'supersecret'
      }
      const payload3 = {
        fullname: 'user test',
        username: 'user123'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })
      const response2 = await server.inject({
        method: 'POST',
        url: '/users',
        payload: payload2
      })
      const response3 = await server.inject({
        method: 'POST',
        url: '/users',
        payload: payload3
      })
      const response4 = await server.inject({
        method: 'POST',
        url: '/users'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      const responseJson2 = JSON.parse(response2.payload)
      const responseJson3 = JSON.parse(response3.payload)
      const responseJson4 = JSON.parse(response4.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
      expect(response2.statusCode).toBe(400)
      expect(responseJson2.status).toBe('fail')
      expect(responseJson2.message).toBe(expectedResponseMessage)
      expect(response3.statusCode).toBe(400)
      expect(responseJson3.status).toBe('fail')
      expect(responseJson3.message).toBe(expectedResponseMessage)
      expect(response4.statusCode).toBe(400)
      expect(responseJson4.status).toBe('fail')
      expect(responseJson4.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code on wrong data type', async () => {
      // Arrange
      const expectedResponseMessage = translate(UserRegistration.ERROR.INVALID_TYPE).message
      const payload = {
        fullname: 'user test',
        username: 123,
        password: 'supersecret'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code if username has more 50 chars', async () => {
      // Arrange
      const expectedResponseMessage = translate(UserRegistration.ERROR.USERNAME_LENGTH_OFFSET).message
      const payload = {
        fullname: 'user test',
        username: 'teststeststeststeststeststeststeststeststeststeststests',
        password: 'supersecret'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code if username has non alphanumeric chars', async () => {
      // Arrange
      const payload = {
        fullname: 'user test',
        username: 'test @123',
        password: 'supersecret'
      }
      const expectedResponseMessage = translate(UserRegistration.ERROR.USERNAME_CONTAINS_FORBIDEN_CHARS).message

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 when username is already taken', async () => {
      // Arrange
      const expectedResponseMessage = UserRepositoryPostgres.ERROR.USERNAME_NOT_AVAILABLE.message
      const username = 'existedusername'
      const payload = {
        fullname: 'user test',
        username,
        password: 'supersecret'
      }

      await UserTableHelper.insert({ id: 'user-9', username })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })
  })
})
