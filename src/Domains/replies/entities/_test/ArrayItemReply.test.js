const ArrayItemReply = require('../ArrayItemReply')

describe('ArrayItemReply', () => {
  const now = new Date()

  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: now,
      isDelete: false
    }
    const payload2 = null

    // Action & Assert
    expect(() => new ArrayItemReply(payload)).toThrowError(ArrayItemReply.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new ArrayItemReply(payload2)).toThrowError(ArrayItemReply.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: false
    }
    const payload2 = {
      id: 'reply-123',
      username: 123,
      date: now,
      content: 'content example',
      isDelete: false
    }
    const payload3 = {
      id: 'reply-123',
      username: 'user-123',
      date: 123,
      content: 'content example',
      isDelete: false
    }
    const payload4 = {
      id: 'reply-123',
      username: 'user-123',
      date: now,
      content: 123,
      isDelete: false
    }
    const payload5 = {
      id: 'reply-123',
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: 123
    }

    // Action & Assert
    expect(() => new ArrayItemReply(payload)).toThrowError(ArrayItemReply.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemReply(payload2)).toThrowError(ArrayItemReply.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemReply(payload3)).toThrowError(ArrayItemReply.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemReply(payload4)).toThrowError(ArrayItemReply.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemReply(payload5)).toThrowError(ArrayItemReply.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload1 = {
      id: 'reply-123',
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: false
    }
    const payload2 = {
      id: 'reply-123',
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: true
    }

    // Action
    const itemComment1 = new ArrayItemReply(payload1)
    const itemComment2 = new ArrayItemReply(payload2)

    // Assert
    expect(itemComment1.id).toBe(payload1.id)
    expect(itemComment1.username).toBe(payload1.username)
    expect(itemComment1.date).toBe(payload1.date.toISOString())
    expect(itemComment1.content).toBe(payload1.content)
    expect(itemComment2.id).toBe(payload2.id)
    expect(itemComment2.username).toBe(payload2.username)
    expect(itemComment2.date).toBe(payload2.date.toISOString())
    expect(itemComment2.content).toBe('**balasan telah dihapus**')
  })
})
