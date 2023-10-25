const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')
const { translate } = require('../../../Commons/exceptions/DomainErrorTranslator')
const TokenTableHelper = require('../../../../tests/TokenTableHelper')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const UserRepositoryPostgres = require('../../repository/UserRepositoryPostgres')
const TokenRepositoryPostgres = require('../../repository/TokenRepositoryPostgres')
const PasswordHashInterface = require('../../../Applications/security/PasswordHashInterface')
const BcryptPasswordHash = require('../../security/BcryptPasswordHash')
const TokenManagerInterface = require('../../../Applications/security/TokenManagerInterface')
const JwtManager = require('../../security/JwtManager')
const UserLogin = require('../../../Domains/users/entities/UserLogin')
const RefreshToken = require('../../../Domains/authentications/entities/RefreshToken')

describe('authentications', () => {
  // Arrange
  let server
  const tokenManager = container.getInstance(TokenManagerInterface.name)
  const passwordHash = container.getInstance(PasswordHashInterface.name)

  beforeAll(async () => {
    server = await createServer(container)
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserTableHelper.clear()
    await TokenTableHelper.clear()
  })

  describe('POST /authentication for login business', () => {
    it('It responds a 201 status code', async () => {
      // Arrange
      const username = 'user123'
      const password = 'supersecret'
      const payload = {
        username,
        password
      }

      await UserTableHelper.insert({
        username,
        password: await passwordHash.hash(password)
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(201)
      expect(responseJson.status).toBe('success')
      expect(responseJson.data.accessToken).toBeDefined()
      expect(responseJson.data.refreshToken).toBeDefined()
    })

    it('It responds a 400 status code if the username does not exist', async () => {
      // Arrange
      const payload = {
        username: 'doesnotexist',
        password: 'supersecret'
      }
      const expectedResponseMessage = UserRepositoryPostgres.ERROR.USER_NOT_FOUND.message

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 401 status code if the password is wrong', async () => {
      // Arrange
      const username = 'user123'
      const password = 'supersecret'
      const payload = {
        username,
        password: 'wrongpassword'
      }
      const expectedResponseMessage = BcryptPasswordHash.ERROR.INVALID_PASSWORD.message

      await UserTableHelper.insert({
        username,
        password: passwordHash.hash(password)
      })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(401)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code if the login payload does not contain needed property', async () => {
      // Arrange
      const payload = {
        username: 'user123'
      }
      const payload2 = {
        password: 'user123'
      }
      const expectedResponseMessage = translate(UserLogin.ERROR.INCOMPLETE_PAYLOAD).message

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload
      })
      const response2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: payload2
      })
      const response3 = await server.inject({
        method: 'POST',
        url: '/authentications'
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

    it('It responds a 400 status code if the login payload has wrong data typed property', async () => {
      // Arrange
      const payload = {
        username: 'user123',
        password: 123
      }
      const expectedResponseMessage = translate(UserLogin.ERROR.INVALID_TYPE).message

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })
  })

  describe('DELETE /authentications for logout business', () => {
    it('It responds a 200 status code if refresh token exists in the database', async () => {
      // Arrange
      const refreshToken = 'refresh-token'
      const payload = {
        refreshToken
      }
      await TokenTableHelper.insert(refreshToken)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toBe(200)
      expect(responseJson.status).toBe('success')
    })

    it('It responds a 400 status code if refresh token does not exist in the database', async () => {
      // Arrange
      const payload = {
        refreshToken: 'doesnotexist-refresh-token'
      }
      const expectedResponseMessage = TokenRepositoryPostgres.ERROR.TOKEN_NOT_FOUND.message

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code if refresh token does not included in the payload', async () => {
      // Arrange
      const payload = {}
      const expectedResponseMessage = translate(RefreshToken.ERROR.INCOMPLETE_PAYLOAD).message

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload
      })

      // Arrange
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code if the refresh token is not a string', async () => {
      // Arrange
      const payload = {
        refreshToken: 1234
      }
      const expectedResponseMessage = translate(RefreshToken.ERROR.INVALID_TYPE).message

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload
      })

      // Arrange
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })
  })

  describe('PUT for refreshing token business', () => {
    it('It responds a 200 status code and new access token', async () => {
      // Arrange
      const refreshToken = tokenManager.generateRefreshToken({ id: 'user-123' })
      const payload = {
        refreshToken
      }

      await TokenTableHelper.insert(refreshToken)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toBe(200)
      expect(responseJson.status).toBe('success')
      expect(responseJson.data.accessToken).toBeDefined()
    })

    it('It responds a 400 status code if the refresh token does not included', async () => {
      // Arrange
      const payload = {}
      const expectedResponseMessage = translate(RefreshToken.ERROR.INCOMPLETE_PAYLOAD).message

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code if the refresh token is not a string', async () => {
      // Arrange
      const payload = {
        refreshToken: 123
      }
      const expectedResponseMessage = translate(RefreshToken.ERROR.INVALID_TYPE).message

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code if the refresh token is not valid/stale', async () => {
      // Arrange
      const payload = {
        refreshToken: 'not-valid-refresh-token'
      }
      const expectedResponseMessage = JwtManager.ERROR.INVALID_REFRESH_TOKEN.message

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toBe(400)
      expect(responseJson.status).toBe('fail')
      expect(responseJson.message).toBe(expectedResponseMessage)
    })

    it('It responds a 400 status code if the refresh token valid but does not exist in the database', async () => {
      // Arrange
      const refreshToken = tokenManager.generateRefreshToken({})
      const payload = {
        refreshToken
      }
      const expectedResponseMessage = TokenRepositoryPostgres.ERROR.TOKEN_NOT_FOUND.message

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
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
