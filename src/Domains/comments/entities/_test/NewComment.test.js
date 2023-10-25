const NewComment = require('../NewComment')

describe('NewComment', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      thread: 'thread-123'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError(NewComment.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new NewComment(payload2)).toThrowError(NewComment.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 'user-123',
      thread: 'thread-123'
    }
    const payload2 = {
      content: 'content example',
      owner: 123,
      thread: 'thread-123'
    }
    const payload3 = {
      content: 'content example',
      owner: 'user-123',
      thread: 123
    }

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError(NewComment.ERROR.INVALID_TYPE)
    expect(() => new NewComment(payload2)).toThrowError(NewComment.ERROR.INVALID_TYPE)
    expect(() => new NewComment(payload3)).toThrowError(NewComment.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      content: 'content example',
      owner: 'user-123',
      thread: 'thread-123'
    }

    // Action
    const { content, owner, thread } = new NewComment(payload)

    // Assert
    expect(content).toBe(payload.content)
    expect(owner).toBe(payload.owner)
    expect(thread).toBe(payload.thread)
  })
})
