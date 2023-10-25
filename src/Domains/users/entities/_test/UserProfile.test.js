const UserProfile = require('../UserProfile')

describe('UserProfile', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      fullname: 'user test'
    }
    const payload2 = null

    // Action & Arrange
    expect(() => new UserProfile(payload)).toThrowError(UserProfile.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new UserProfile(payload2)).toThrowError(UserProfile.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'user123',
      fullname: 'user test'
    }
    const payload2 = {
      id: 'user-1',
      username: 343434,
      fullname: 'user test'
    }
    const payload3 = {
      id: 'user-1',
      username: 'user123',
      fullname: 1234
    }

    // Action & Assert
    expect(() => new UserProfile(payload)).toThrowError(UserProfile.ERROR.INVALID_TYPE)
    expect(() => new UserProfile(payload2)).toThrowError(UserProfile.ERROR.INVALID_TYPE)
    expect(() => new UserProfile(payload3)).toThrowError(UserProfile.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      id: 'user-1',
      username: 'user123',
      fullname: 'user test'
    }

    // Action
    const { id, username, fullname } = new UserProfile(payload)

    // Assert
    expect(id).toEqual(payload.id)
    expect(username).toEqual(payload.username)
    expect(fullname).toEqual(payload.fullname)
  })
})
