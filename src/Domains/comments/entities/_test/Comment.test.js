const Comment = require('../Comment')

describe('Comment', () => {
  const now = new Date()

  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content example',
      owner: 'user-123',
      thread: 'thread-123',
      date: now
    }
    const payload2 = null

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(Comment.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new Comment(payload2)).toThrowError(Comment.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'content example',
      isDelete: false,
      owner: 'user-123',
      thread: 'thread-123',
      date: now
    }
    const payload2 = {
      id: 'comment-123',
      content: 234,
      isDelete: 'user-test',
      owner: 'user-123',
      thread: 'thread-123',
      date: now
    }
    const payload3 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: 1234,
      owner: 'user-123',
      thread: 'thread-123',
      date: now
    }
    const payload4 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: 1234,
      owner: 'user-123',
      thread: 'thread-123',
      date: now
    }
    const payload5 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: false,
      owner: 123,
      thread: 'thread-123',
      date: now
    }
    const payload6 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: false,
      owner: 'owner-123',
      thread: 123,
      date: now
    }
    const payload7 = {
      id: 'comment-123',
      content: 'content example',
      isDelete: false,
      owner: 'owner-123',
      thread: 'thread-123',
      date: 123
    }

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError(Comment.ERROR.INVALID_TYPE)
    expect(() => new Comment(payload2)).toThrowError(Comment.ERROR.INVALID_TYPE)
    expect(() => new Comment(payload3)).toThrowError(Comment.ERROR.INVALID_TYPE)
    expect(() => new Comment(payload4)).toThrowError(Comment.ERROR.INVALID_TYPE)
    expect(() => new Comment(payload5)).toThrowError(Comment.ERROR.INVALID_TYPE)
    expect(() => new Comment(payload6)).toThrowError(Comment.ERROR.INVALID_TYPE)
    expect(() => new Comment(payload7)).toThrowError(Comment.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content example',
      isDelete: false,
      owner: 'user-123',
      thread: 'thread-123',
      date: now
    }

    // Action
    const { id, content, isDelete, owner, thread, date } = new Comment(payload)

    // Assert
    expect(id).toBe(payload.id)
    expect(content).toBe(payload.content)
    expect(isDelete).toBe(payload.isDelete)
    expect(owner).toBe(payload.owner)
    expect(thread).toBe(payload.thread)
    expect(date).toBe(now)
  })
})
