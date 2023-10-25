const UserRepositoryInterface = require('../../../Domains/users/UserRepositoryInterface')
const TokenRepositoryInterface = require('../../../Domains/authentications/TokenRepositoryInterface')
const PasswordHashInterface = require('../../security/PasswordHashInterface')
const TokenManagerInterface = require('../../security/TokenManagerInterface')
const NewAuthentication = require('../../../Domains/authentications/entities/NewAuthentication')
const User = require('../../../Domains/users/entities/User')
const RefreshToken = require('../../../Domains/authentications/entities/RefreshToken')
const AuthenticationUseCase = require('../AuthenticationUseCase')

describe('AuthenticationUseCase', () => {
  // Arrange
  class MockUserRepository extends UserRepositoryInterface {}
  const mockUserRepository = new MockUserRepository()

  class MockTokenRepository extends TokenRepositoryInterface {}
  const mockTokenRepository = new MockTokenRepository()

  class MockPasswordHash extends PasswordHashInterface {}
  const mockPasswordHash = new MockPasswordHash()

  class MockTokenManager extends TokenManagerInterface {}
  const mockTokenManager = new MockTokenManager()

  const authenticationUseCase = new AuthenticationUseCase({
    userRepository: mockUserRepository,
    tokenRepository: mockTokenRepository,
    passwordHash: mockPasswordHash,
    tokenManager: mockTokenManager
  })

  describe('Instantiation throws an Error if the one of the dependencies does not implement the interface', () => {
    // Arrange
    let dependencies

    beforeEach(() => {
      dependencies = {
        userRepository: mockUserRepository,
        tokenRepository: mockTokenRepository,
        passwordHash: mockPasswordHash,
        tokenManager: mockTokenManager
      }
    })

    it('It throws an error if userRepository does not implement UserRepositoryInterface', () => {
      // Arrange
      dependencies.userRepository = {}

      // Action & Assert
      expect(() => new AuthenticationUseCase(dependencies)).toThrowError(AuthenticationUseCase.ERROR.INVALID_USER_REPOSITORY)
    })

    it('It throws an error if tokenRepository does not implement TokenRepositoryInterface', () => {
      // Arrange
      dependencies.tokenRepository = {}

      // Action & Assert
      expect(() => new AuthenticationUseCase(dependencies)).toThrowError(AuthenticationUseCase.ERROR.INVALID_TOKEN_REPOSITORY)
    })

    it('It throws an error if passwordHash does not implement PasswordHashInterface', () => {
      // Arrange
      dependencies.passwordHash = {}

      // Action & Assert
      expect(() => new AuthenticationUseCase(dependencies)).toThrowError(AuthenticationUseCase.ERROR.INVALID_PASSWORD_HASH)
    })

    it('It throws an error if tokenManager does not implement TokenManagerInterface', () => {
      // Arrange
      dependencies.tokenManager = {}

      // Action & Assert
      expect(() => new AuthenticationUseCase(dependencies)).toThrowError(AuthenticationUseCase.ERROR.INVALID_TOKEN_MANAGER)
    })
  })

  describe('login', () => {
    it('It orchestrates the login business correctly', async () => {
      // Arrange
      const payload = {
        username: 'user123',
        password: 'supersecret'
      }
      const expectedUser = new User({
        id: 'user-123',
        fullname: 'user test',
        username: payload.username,
        password: payload.password
      })
      const expectedNewAuthentication = new NewAuthentication({
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      })

      mockUserRepository.getByUsername = jest.fn().mockImplementation(() => Promise.resolve(expectedUser))
      mockPasswordHash.compare = jest.fn().mockImplementation(() => Promise.resolve())
      mockTokenManager.generateAccessToken = jest.fn().mockImplementation(() => expectedNewAuthentication.accessToken)
      mockTokenManager.generateRefreshToken = jest.fn().mockImplementation(() => expectedNewAuthentication.refreshToken)
      mockTokenRepository.add = jest.fn().mockImplementation(() => Promise.resolve())

      // Action
      const newAuthentication = await authenticationUseCase.login(payload)

      // Assert
      expect(mockUserRepository.getByUsername).toBeCalledWith(payload.username)
      expect(mockPasswordHash.compare).toBeCalledWith(payload.password, expectedUser.password)
      expect(mockTokenManager.generateAccessToken).toBeCalledWith({ id: expectedUser.id, username: expectedUser.username })
      expect(mockTokenManager.generateRefreshToken).toBeCalledWith({ id: expectedUser.id, username: expectedUser.username })
      expect(mockTokenRepository.add).toBeCalledWith(expectedNewAuthentication.refreshToken)
      expect(newAuthentication).toStrictEqual(expectedNewAuthentication)
    })
  })

  describe('logout', () => {
    it('It orchestrates the logout business correctly', async () => {
      // Arrange
      const payload = {
        refreshToken: 'refresh-token'
      }
      const expectedToken = new RefreshToken({ token: payload.refreshToken })

      mockTokenRepository.verifyExistByToken = jest.fn().mockImplementation(() => Promise.resolve())
      mockTokenRepository.delete = jest.fn().mockImplementation(() => Promise.resolve())

      // Action
      await authenticationUseCase.logout(payload)

      // Assert
      expect(mockTokenRepository.verifyExistByToken).toBeCalledWith(expectedToken.token)
      expect(mockTokenRepository.delete).toBeCalledWith(expectedToken.token)
    })
  })

  describe('refreshAuthentication', () => {
    const payload = {
      refreshToken: 'refresh-token'
    }

    it('It throws an error if payload is incompleted', async () => {
      // Arrange
      delete payload.refreshToken

      // Action & Assert
      await expect(authenticationUseCase.refreshAuthentication(payload)).rejects.toThrowError(RefreshToken.ERROR.INCOMPLETE_PAYLOAD)
    })

    it('It throws an error if the refresh token is not a string', async () => {
      // Arrange
      payload.refreshToken = 1234

      // Action & Assert
      await expect(authenticationUseCase.refreshAuthentication(payload)).rejects.toThrowError(RefreshToken.ERROR.INVALID_TYPE)
    })

    it('It orchestrates the refreshing authentication correctly', async () => {
      // Arrange
      payload.refreshToken = 'refresh-token'
      const expectedArtifactPayload = {
        id: 'user-123',
        username: 'user123'
      }
      const expectedAccessToken = 'access-token'

      mockTokenRepository.verifyExistByToken = jest.fn().mockImplementation(() => Promise.resolve())
      mockTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => true)
      mockTokenManager.generateAccessToken = jest.fn().mockImplementation(() => expectedAccessToken)
      mockTokenManager.decodeToken = jest.fn().mockImplementation(() => expectedArtifactPayload)

      // Action
      const token = await authenticationUseCase.refreshAuthentication(payload)

      // Assert
      expect(mockTokenManager.verifyRefreshToken).toBeCalledWith(payload.refreshToken)
      expect(mockTokenRepository.verifyExistByToken).toBeCalledWith(payload.refreshToken)
      expect(mockTokenManager.decodeToken).toBeCalledWith(payload.refreshToken)
      expect(mockTokenManager.generateAccessToken).toBeCalledWith(expectedArtifactPayload)
      expect(token).toStrictEqual(expectedAccessToken)
    })
  })
})
