const DetailedThread = require('../DetailedThread')

describe('DetailedThread', () => {
  const now = new Date()

  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      body: 'body example',
      date: now,
      username: 'user123'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new DetailedThread(payload)).toThrowError(DetailedThread.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new DetailedThread(payload2)).toThrowError(DetailedThread.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'title example',
      body: 'body example',
      date: now,
      username: 'user123'
    }
    const payload2 = {
      id: 'thread-123',
      title: 123,
      body: 'body example',
      date: now,
      username: 'user123'
    }
    const payload3 = {
      id: 'thread-123',
      title: 'title example',
      body: 123,
      date: now,
      username: 'user123'
    }
    const payload4 = {
      id: 'thread-123',
      title: 'title example',
      body: 'body example',
      date: 123,
      username: 'user123'
    }
    const payload5 = {
      id: 'thread-123',
      title: 'title example',
      body: 'body example',
      date: now,
      username: 123
    }

    // Action & Assert
    expect(() => new DetailedThread(payload)).toThrowError(DetailedThread.ERROR.INVALID_TYPE)
    expect(() => new DetailedThread(payload2)).toThrowError(DetailedThread.ERROR.INVALID_TYPE)
    expect(() => new DetailedThread(payload3)).toThrowError(DetailedThread.ERROR.INVALID_TYPE)
    expect(() => new DetailedThread(payload4)).toThrowError(DetailedThread.ERROR.INVALID_TYPE)
    expect(() => new DetailedThread(payload5)).toThrowError(DetailedThread.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title example',
      body: 'body example',
      date: now,
      username: 'user123'
    }

    // Action
    const { id, title, body, date, username } = new DetailedThread(payload)

    // Assert
    expect(id).toBe(payload.id)
    expect(title).toBe(payload.title)
    expect(body).toBe(payload.body)
    expect(date).toBe(payload.date.toISOString())
    expect(username).toBe(payload.username)
  })
})
