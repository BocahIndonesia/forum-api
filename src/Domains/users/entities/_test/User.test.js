const User = require('../User')

describe('User', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      fullname: 'user test',
      password: 'hash(password)'
    }
    const payload2 = null

    // Action & Arrange
    expect(() => new User(payload)).toThrowError(User.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new User(payload2)).toThrowError(User.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'user123',
      fullname: 'user test',
      password: 'hash(password)'
    }
    const payload2 = {
      id: 'user-1',
      username: 234,
      fullname: 'user-test',
      password: 'hash(password)'
    }
    const payload3 = {
      id: 'user-1',
      username: 'user123',
      fullname: 1234,
      password: 'hash(password)'
    }
    const payload4 = {
      id: 'user-1',
      username: 'user123',
      fullname: 1234,
      password: 'hash(password)'
    }
    const payload5 = {
      id: 'user-1',
      username: 'user123',
      fullname: 'user test',
      password: 123
    }

    // Action & Assert
    expect(() => new User(payload)).toThrowError(User.ERROR.INVALID_TYPE)
    expect(() => new User(payload2)).toThrowError(User.ERROR.INVALID_TYPE)
    expect(() => new User(payload3)).toThrowError(User.ERROR.INVALID_TYPE)
    expect(() => new User(payload4)).toThrowError(User.ERROR.INVALID_TYPE)
    expect(() => new User(payload5)).toThrowError(User.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      id: 'user-1',
      username: 'user123',
      fullname: 'user test',
      password: 'hash(password)'
    }

    // Action
    const { id, username, fullname, password } = new User(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(fullname).toEqual(payload.fullname)
    expect(password).toEqual(payload.password)
  })
})
