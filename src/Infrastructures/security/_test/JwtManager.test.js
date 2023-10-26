const jwt = require('@hapi/jwt')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const JwtManager = require('../JwtManager')

describe('JwtManager', () => {
  // Arrange
  const payload = {
    id: 'user-123',
    username: 'user123'
  }
  const accessTokenKey = 11
  const refreshTokenKey = 22
  const accessTokenAge = 3000

  describe('generateAccessToken', () => {
    const expectedToken = 'expected-token'
    const mockJwtToken = {
      generate: jest.fn().mockImplementation(() => expectedToken)
    }
    const jwtManager = new JwtManager({ jwt: mockJwtToken, accessTokenKey, refreshTokenKey, accessTokenAge })

    it('It generates Access Token', () => {
      // Action
      const token = jwtManager.generateAccessToken(payload)

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, accessTokenKey, { ttlSec: accessTokenAge })
      expect(token).toBe(expectedToken)
    })
  })

  describe('generateRefreshToken', () => {
    const expectedToken = 'expected-token'
    const mockJwtToken = {
      generate: jest.fn().mockImplementation(() => expectedToken)
    }
    const jwtManager = new JwtManager({ jwt: mockJwtToken, accessTokenKey, refreshTokenKey, accessTokenAge })

    it('It generates Refresh Token', () => {
      // Action
      const token = jwtManager.generateRefreshToken(payload)

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, refreshTokenKey)
      expect(token).toBe(expectedToken)
    })
  })

  describe('verifyRefreshToken', () => {
    // Assert
    const jwtManager = new JwtManager({ jwt: jwt.token, accessTokenKey, refreshTokenKey, accessTokenAge })

    it('It throws InvariantError when the token is invalid', () => {
      // Action & Assert
      expect(() => jwtManager.verifyRefreshToken('non-valid-token')).toThrow(InvariantError)
    })

    it('It does not throw InvariantError if the token is valid', () => {
      // Arrange
      const validToken = jwtManager.generateRefreshToken(payload)

      // Action & Assert
      expect(() => jwtManager.verifyRefreshToken(validToken)).not.toThrow(InvariantError)
    })
  })

  describe('verifyAccessToken', () => {
    // Assert
    const jwtManager = new JwtManager({ jwt: jwt.token, accessTokenKey, refreshTokenKey, accessTokenAge })

    it('It throws InvariantError when the token is invalid', () => {
      // Action & Assert
      expect(() => jwtManager.verifyAccessToken('non-valid-token')).toThrow(InvariantError)
    })

    it('It does not throw InvariantError if the token is valid', () => {
      // Arrange
      const validToken = jwtManager.generateAccessToken(payload)

      // Action & Assert
      expect(() => jwtManager.verifyAccessToken(validToken)).not.toThrow(InvariantError)
    })
  })

  describe('decodeToken', () => {
    // Assert
    const jwtManager = new JwtManager({ jwt: jwt.token, accessTokenKey, refreshTokenKey, accessTokenAge })

    it('It decodes payload correctly', () => {
      // Arrange
      const accessToken = jwtManager.generateAccessToken(payload)

      // Action
      const { id, username } = jwtManager.decodeToken(accessToken)

      // Assert
      expect(id).toBe(payload.id)
      expect(username).toBe(payload.username)
    })
  })
})
