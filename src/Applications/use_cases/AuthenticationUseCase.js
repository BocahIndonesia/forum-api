const UserRepositoryInterface = require('../../Domains/users/UserRepositoryInterface')
const TokenRepositoryInterface = require('../../Domains/authentications/TokenRepositoryInterface')
const PasswordHashInterface = require('../security/PasswordHashInterface')
const TokenManagerInterface = require('../security/TokenManagerInterface')
const UserLogin = require('../../Domains/users/entities/UserLogin')
const NewAuthentication = require('../../Domains/authentications/entities/NewAuthentication')
const RefreshToken = require('../../Domains/authentications/entities/RefreshToken')

module.exports = class AuthenticationUseCase {
  constructor (dependencies) {
    const { userRepository, tokenRepository, passwordHash, tokenManager } = AuthenticationUseCase.prepareDependencies(dependencies)

    this._userRepository = userRepository
    this._tokenRepository = tokenRepository
    this._passwordHash = passwordHash
    this._tokenManager = tokenManager
  }

  static ERROR = {
    INVALID_USER_REPOSITORY: new Error('AUTHENTICATION_USE_CASE.DOES_NOT_IMPLEMENT_USER_REPOSITORY_INTERFACE'),
    INVALID_TOKEN_REPOSITORY: new Error('AUTHENTICATION_USE_CASE.DOES_NOT_IMPLEMENT_TOKEN_REPOSITORY_INTERFACE'),
    INVALID_PASSWORD_HASH: new Error('AUTHENTICATION_USE_CASE.DOES_NOT_IMPLEMENT_PASSWORD_HASH_INTERFACE'),
    INVALID_TOKEN_MANAGER: new Error('AUTHENTICATION_USE_CASE.DOES_NOT_IMPLEMENT_TOKEN_MANAGER_INTERFACE')
  }

  static prepareDependencies (dependencies) {
    const { userRepository, tokenRepository, passwordHash, tokenManager } = dependencies

    if (!(userRepository instanceof UserRepositoryInterface)) throw AuthenticationUseCase.ERROR.INVALID_USER_REPOSITORY
    if (!(tokenRepository instanceof TokenRepositoryInterface)) throw AuthenticationUseCase.ERROR.INVALID_TOKEN_REPOSITORY
    if (!(passwordHash instanceof PasswordHashInterface)) throw AuthenticationUseCase.ERROR.INVALID_PASSWORD_HASH
    if (!(tokenManager instanceof TokenManagerInterface)) throw AuthenticationUseCase.ERROR.INVALID_TOKEN_MANAGER

    return dependencies
  }

  async login (payload) {
    const userLogin = new UserLogin(payload)
    const user = await this._userRepository.getByUsername(userLogin.username)

    await this._passwordHash.compare(userLogin.password, user.password)

    const accessToken = this._tokenManager.generateAccessToken({ id: user.id, username: user.username })
    const refreshToken = this._tokenManager.generateRefreshToken({ id: user.id, username: user.username })

    await this._tokenRepository.add(refreshToken)

    return new NewAuthentication({ accessToken, refreshToken })
  }

  async logout (payload) {
    const token = new RefreshToken({ token: payload.refreshToken })

    await this._tokenRepository.verifyExistByToken(token.token)
    await this._tokenRepository.delete(token.token)
  }

  async refreshAuthentication (payload) {
    const token = new RefreshToken({ token: payload.refreshToken })

    await this._tokenManager.verifyRefreshToken(token.token)
    await this._tokenRepository.verifyExistByToken(token.token)

    const { id, username } = this._tokenManager.decodeToken(token.token)
    const accessToken = this._tokenManager.generateAccessToken({ id, username })

    return accessToken
  }
}
