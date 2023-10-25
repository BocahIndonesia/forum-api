const TokenManagerInterface = require('../TokenManagerInterface')

describe('TokenManagerInterface', () => {
  it('Instantiation throws an error on direct instantiation', () => {
    expect(() => new TokenManagerInterface()).toThrowError(TokenManagerInterface.ERROR.ABSTRACT_INSTATIATION)
  })

  // Arrange
  class StubTokenManager extends TokenManagerInterface {}
  const stubTokenManager = new StubTokenManager()

  describe('generateAccessToken', () => {
    it('It throws an error if method has not been implemented inside the child class', () => {
      // Action & Assert
      expect(() => stubTokenManager.generateAccessToken({})).toThrowError(TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })

  describe('generateRefreshToken', () => {
    it('It throws an error if method has not been implemented inside the child class', () => {
      // Action & Assert
      expect(() => stubTokenManager.generateRefreshToken({})).toThrowError(TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyAccessToken', () => {
    it('It throws an error if method has not been implemented inside the child class', () => {
      // Action & Assert
      expect(() => stubTokenManager.verifyAccessToken('')).toThrowError(TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyRefreshToken', () => {
    it('It throws an error if method has not been implemented inside the child class', () => {
      // Action & Assert
      expect(() => stubTokenManager.verifyRefreshToken('')).toThrowError(TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })

  describe('decodeToken', () => {
    it('It throws an error if method has not been implemented inside the child class', () => {
      // Action & Assert
      expect(() => stubTokenManager.decodeToken('')).toThrowError(TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })

  describe('extractAccessTokenFromBearer', () => {
    it('It throws an error if method has not been implemented inside the child class', () => {
      // Action & Assert
      expect(() => stubTokenManager.extractAccessTokenFromBearer('')).toThrowError(TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })
})
