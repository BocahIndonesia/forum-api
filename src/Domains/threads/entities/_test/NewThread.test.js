const NewThread = require('../NewThread')

describe('NewThread', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      title: 'title example',
      owner: 'user-123'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(NewThread.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new NewThread(payload2)).toThrowError(NewThread.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      title: 'title example',
      body: 1234,
      owner: 'user-123'
    }
    const payload2 = {
      title: 'title example',
      body: 'body example',
      owner: 123
    }

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(NewThread.ERROR.INVALID_TYPE)
    expect(() => new NewThread(payload2)).toThrowError(NewThread.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      title: 'title example',
      body: 'body example',
      owner: 'user-123'
    }

    // Action
    const { title, body, owner } = new NewThread(payload)

    // Assert
    expect(title).toBe(payload.title)
    expect(body).toBe(payload.body)
    expect(owner).toBe(payload.owner)
  })
})
