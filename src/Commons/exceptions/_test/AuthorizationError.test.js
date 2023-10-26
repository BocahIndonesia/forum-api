const AuthorizationError = require('../AuthorizationError')

describe('AuthorizationError', () => {
  it('instantiates AuthorizationError', () => {
    // Arrange
    const errorMsg = 'Authentication error'

    // Action
    const { name, code, message } = new AuthorizationError(errorMsg)

    // Assert
    expect(name).toEqual(AuthorizationError.name)
    expect(code).toEqual(403)
    expect(message).toEqual(errorMsg)
  })
})
