const AuthenticationError = require('../AuthenticationError')

describe('AuthenticationError', () => {
  it('instantiates AuthenticationError', () => {
    // Arrange
    const errorMsg = 'Authentication error'

    // Action
    const { name, code, message } = new AuthenticationError(errorMsg)

    // Assert
    expect(name).toEqual(AuthenticationError.name)
    expect(code).toEqual(401)
    expect(message).toEqual(errorMsg)
  })
})
