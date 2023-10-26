const TokenManagerInterface = require('../../Applications/security/TokenManagerInterface')
const InvariantError = require('../../Commons/exceptions/InvariantError')
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError')

module.exports = class JwtManager extends TokenManagerInterface {
  constructor (dependencies) {
    super()

    const { jwt, accessTokenKey, refreshTokenKey, accessTokenAge } = dependencies

    this._jwt = jwt
    this._accessTokenKey = accessTokenKey
    this._refreshTokenKey = refreshTokenKey
    this._accessTokenAge = accessTokenAge
  }

  static ERROR = {
    INVALID_REFRESH_TOKEN: new InvariantError('refresh token tidak valid'),
    INVALID_ACCESS_TOKEN: new InvariantError('access token tidak valid'),
    MISSING_AUTHENTICATION: new AuthenticationError('Missing authentication')
  }

  static extractAccessTokenFromBearer (bearer) {
    if (!bearer) {
      throw JwtManager.ERROR.MISSING_AUTHENTICATION
    }
    return bearer.replace(/^Bearer\s+/, '')
  }

  generateAccessToken (payload) {
    return this._jwt.generate(payload, this._accessTokenKey, { ttlSec: this._accessTokenAge })
  }

  generateRefreshToken (payload) {
    return this._jwt.generate(payload, this._refreshTokenKey)
  }

  verifyRefreshToken (token) {
    try {
      const artifacts = this._jwt.decode(token)
      this._jwt.verify(artifacts, this._refreshTokenKey)
    } catch (error) {
      throw JwtManager.ERROR.INVALID_REFRESH_TOKEN
    }
  }

  verifyAccessToken (token) {
    try {
      const artifacts = this._jwt.decode(token)
      this._jwt.verify(artifacts, this._accessTokenKey)
    } catch (error) {
      throw JwtManager.ERROR.INVALID_ACCESS_TOKEN
    }
  }

  decodeToken (token) {
    const artifacts = this._jwt.decode(token)
    return artifacts.decoded.payload
  }
}
