const NewReply = require('../NewReply')

describe('NewReply', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      comment: 'comment-123'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(NewReply.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new NewReply(payload2)).toThrowError(NewReply.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 'user-123',
      comment: 'comment-123'
    }
    const payload2 = {
      content: 'content example',
      owner: 123,
      comment: 'comment-123'
    }
    const payload3 = {
      content: 'content example',
      owner: 'user-123',
      comment: 123
    }

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(NewReply.ERROR.INVALID_TYPE)
    expect(() => new NewReply(payload2)).toThrowError(NewReply.ERROR.INVALID_TYPE)
    expect(() => new NewReply(payload3)).toThrowError(NewReply.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      content: 'content example',
      owner: 'user-123',
      comment: 'comment-123'
    }

    // Action
    const { content, owner, comment } = new NewReply(payload)

    // Assert
    expect(content).toBe(payload.content)
    expect(owner).toBe(payload.owner)
    expect(comment).toBe(payload.comment)
  })
})
