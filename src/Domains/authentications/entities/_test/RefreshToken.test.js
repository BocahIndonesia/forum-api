const RefreshToken = require('../RefreshToken')

describe('RefreshToken', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {}
    const payload2 = null

    // Action & Assert
    expect(() => new RefreshToken(payload)).toThrowError(RefreshToken.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new RefreshToken(payload2)).toThrowError(RefreshToken.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      token: 123
    }

    // Action & Assert
    expect(() => new RefreshToken(payload)).toThrowError(RefreshToken.ERROR.INVALID_TYPE)
  })

  it('Instantiate a correct object on a valid payload', () => {
    // Arrange
    const payload = {
      token: 'refresh-token'
    }

    // Action
    const token = new RefreshToken(payload)

    // Assert
    expect(token).toBeInstanceOf(RefreshToken)
    expect(token.token).toBe(payload.token)
  })
})
