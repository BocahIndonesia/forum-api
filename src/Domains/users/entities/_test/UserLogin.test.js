const UserLogin = require('../UserLogin')

describe('UserLogin', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      username: 'user123'
    }
    const payload2 = null

    // Action & Arrange
    expect(() => new UserLogin(payload)).toThrowError(UserLogin.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new UserLogin(payload2)).toThrowError(UserLogin.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      username: 'user123',
      password: 123
    }
    const payload2 = {
      username: 123,
      password: 'supersecret'
    }

    // Action & Assert
    expect(() => new UserLogin(payload)).toThrowError(UserLogin.ERROR.INVALID_TYPE)
    expect(() => new UserLogin(payload2)).toThrowError(UserLogin.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      username: 'user123',
      password: 'supersecret'
    }

    // Action
    const { username, password } = new UserLogin(payload)

    // Assert
    expect(username).toEqual(payload.username)
    expect(password).toEqual(payload.password)
  })
})
