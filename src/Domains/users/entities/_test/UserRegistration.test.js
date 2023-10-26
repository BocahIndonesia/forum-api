const UserRegistration = require('../UserRegistration')

describe('UserRegistration', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      username: 'user123',
      fullname: 'user test'
    }
    const payload2 = null

    // Action & Arrange
    expect(() => new UserRegistration(payload)).toThrowError(UserRegistration.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new UserRegistration(payload2)).toThrowError(UserRegistration.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      username: 'user123',
      fullname: 1234,
      password: 'supersecret'
    }
    const payload2 = {
      username: 'user123',
      fullname: 'user test',
      password: 123
    }

    // Action & Assert
    expect(() => new UserRegistration(payload)).toThrowError(UserRegistration.ERROR.INVALID_TYPE)
    expect(() => new UserRegistration(payload2)).toThrowError(UserRegistration.ERROR.INVALID_TYPE)
  })

  it('Instantiation throws an error if length of the username exceed 50 characters', () => {
    // Arrange
    const payload = {
      username: 'teststeststeststeststeststeststeststeststeststeststests',
      fullname: 'user test',
      password: 'hash(password)'
    }

    // Action & Assert
    expect(() => new UserRegistration(payload)).toThrowError(UserRegistration.ERROR.USERNAME_LENGTH_OFFSET)
  })

  it('Instantiation throws an error if the username contains non-alphanumeric characters', () => {
    // Arrange
    const payload = {
      username: 'tuyul@test lol',
      fullname: 'user test',
      password: 'hash(password)'
    }

    // Action & Assert
    expect(() => new UserRegistration(payload)).toThrowError(UserRegistration.ERROR.USERNAME_CONTAINS_FORBIDEN_CHARS)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      username: 'user123',
      fullname: 'user test',
      password: 'supersecret'
    }

    // Action
    const { username, fullname, password } = new UserRegistration(payload)

    // Assert
    expect(username).toEqual(payload.username)
    expect(fullname).toEqual(payload.fullname)
    expect(password).toEqual(payload.password)
  })
})
