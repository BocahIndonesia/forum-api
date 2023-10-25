const Thread = require('../Thread')

describe('Thread', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title example',
      owner: 'user-123'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError(Thread.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new Thread(payload2)).toThrowError(Thread.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const now = new Date()
    const payload = {
      id: 123,
      title: 'title example',
      body: 'body example',
      owner: 'user-123',
      date: now
    }
    const payload2 = {
      id: 'thread-123',
      title: 234,
      body: 'user-test',
      owner: 'user-123',
      date: now
    }
    const payload3 = {
      id: 'thread-123',
      title: 'title example',
      body: 1234,
      owner: 'user-123',
      date: now
    }
    const payload4 = {
      id: 'thread-123',
      title: 'title example',
      body: 1234,
      owner: 'user-123',
      date: now
    }
    const payload5 = {
      id: 'thread-123',
      title: 'title example',
      body: 'body example',
      owner: 123,
      date: now
    }
    const payload6 = {
      id: 'thread-123',
      title: 'title example',
      body: 'body example',
      owner: 'user-123',
      date: 123
    }

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError(Thread.ERROR.INVALID_TYPE)
    expect(() => new Thread(payload2)).toThrowError(Thread.ERROR.INVALID_TYPE)
    expect(() => new Thread(payload3)).toThrowError(Thread.ERROR.INVALID_TYPE)
    expect(() => new Thread(payload4)).toThrowError(Thread.ERROR.INVALID_TYPE)
    expect(() => new Thread(payload5)).toThrowError(Thread.ERROR.INVALID_TYPE)
    expect(() => new Thread(payload6)).toThrowError(Thread.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const now = new Date()
    const payload = {
      id: 'thread-123',
      title: 'title example',
      body: 'body example',
      owner: 'user-123',
      date: now
    }

    // Action
    const { id, title, body, owner, date } = new Thread(payload)

    // Assert
    expect(id).toBe(payload.id)
    expect(title).toBe(payload.title)
    expect(body).toBe(payload.body)
    expect(owner).toBe(payload.owner)
    expect(date).toBe(now)
  })
})
