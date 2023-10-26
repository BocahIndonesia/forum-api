const NewAuthentication = require('../NewAuthentication')

describe('NewAuthentication', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      accessToken: 'access-token'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new NewAuthentication(payload)).toThrowError(NewAuthentication.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new NewAuthentication(payload2)).toThrowError(NewAuthentication.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      accessToken: 123,
      refreshToken: 'refresh-token'
    }
    const payload2 = {
      accessToken: 'access-token',
      refreshToken: 123
    }

    // Action & Assert
    expect(() => new NewAuthentication(payload)).toThrowError(NewAuthentication.ERROR.INVALID_TYPE)
    expect(() => new NewAuthentication(payload2)).toThrowError(NewAuthentication.ERROR.INVALID_TYPE)
  })

  it('Instantiate a correct object on a valid payload', () => {
    // Arrange
    const payload = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    }

    // Action
    const newAuthentication = new NewAuthentication(payload)

    // Assert
    expect(newAuthentication).toBeInstanceOf(NewAuthentication)
    expect(newAuthentication.accessToken).toBe(payload.accessToken)
    expect(newAuthentication.refreshToken).toBe(payload.refreshToken)
  })
})
