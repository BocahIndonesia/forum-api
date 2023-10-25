const Reply = require('../Reply')

describe('Reply', () => {
  // Arrange
  const now = new Date()

  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content example',
      owner: 'user-123',
      comment: 'comment-123',
      date: now
    }
    const payload2 = null

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError(Reply.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new Reply(payload2)).toThrowError(Reply.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'content example',
      isDelete: false,
      owner: 'user-123',
      comment: 'comment-123',
      date: now
    }
    const payload2 = {
      id: 'comment-123',
      content: 234,
      isDelete: 'user-test',
      owner: 'user-123',
      comment: 'comment-123',
      date: now
    }
    const payload3 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: 1234,
      owner: 'user-123',
      comment: 'comment-123',
      date: now
    }
    const payload4 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: 1234,
      owner: 'user-123',
      comment: 'comment-123',
      date: now
    }
    const payload5 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: false,
      owner: 123,
      comment: 'comment-123',
      date: now
    }
    const payload6 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: false,
      owner: 'owner-123',
      comment: 123,
      date: now
    }
    const payload7 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: false,
      owner: 'owner-123',
      comment: 'comment-123',
      date: 123
    }

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError(Reply.ERROR.INVALID_TYPE)
    expect(() => new Reply(payload2)).toThrowError(Reply.ERROR.INVALID_TYPE)
    expect(() => new Reply(payload3)).toThrowError(Reply.ERROR.INVALID_TYPE)
    expect(() => new Reply(payload4)).toThrowError(Reply.ERROR.INVALID_TYPE)
    expect(() => new Reply(payload5)).toThrowError(Reply.ERROR.INVALID_TYPE)
    expect(() => new Reply(payload6)).toThrowError(Reply.ERROR.INVALID_TYPE)
    expect(() => new Reply(payload7)).toThrowError(Reply.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content example',
      isDelete: false,
      owner: 'user-123',
      comment: 'comment-123',
      date: now
    }

    // Action
    const { id, content, isDelete, owner, comment, date } = new Reply(payload)

    // Assert
    expect(id).toBe(payload.id)
    expect(content).toBe(payload.content)
    expect(isDelete).toBe(payload.isDelete)
    expect(owner).toBe(payload.owner)
    expect(comment).toBe(payload.comment)
    expect(date).toBe(payload.date)
  })
})
