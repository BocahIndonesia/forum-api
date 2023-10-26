const InfoThread = require('../InfoThread')

describe('InfoThread', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      owner: 'user-123'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new InfoThread(payload)).toThrowError(InfoThread.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new InfoThread(payload2)).toThrowError(InfoThread.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'title example',
      owner: 'user-123'
    }
    const payload2 = {
      id: 'thread-123',
      title: 123,
      owner: 'user-123'
    }
    const payload3 = {
      id: 'thread-123',
      title: 'title example',
      owner: 123
    }

    // Action & Assert
    expect(() => new InfoThread(payload)).toThrowError(InfoThread.ERROR.INVALID_TYPE)
    expect(() => new InfoThread(payload2)).toThrowError(InfoThread.ERROR.INVALID_TYPE)
    expect(() => new InfoThread(payload3)).toThrowError(InfoThread.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title example',
      owner: 'user-123'
    }

    // Action
    const { id, title, owner } = new InfoThread(payload)

    // Assert
    expect(id).toBe(payload.id)
    expect(title).toBe(payload.title)
    expect(owner).toBe(payload.owner)
  })
})
