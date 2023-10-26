const InfoReply = require('../InfoReply')

describe('InfoReply', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new InfoReply(payload)).toThrowError(InfoReply.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new InfoReply(payload2)).toThrowError(InfoReply.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'content example',
      owner: 'user-123'
    }
    const payload2 = {
      id: 'comment-123',
      content: 123,
      owner: 'user-123'
    }
    const payload3 = {
      id: 'comment-123',
      content: 'content example',
      owner: 123
    }

    // Action & Assert
    expect(() => new InfoReply(payload)).toThrowError(InfoReply.ERROR.INVALID_TYPE)
    expect(() => new InfoReply(payload2)).toThrowError(InfoReply.ERROR.INVALID_TYPE)
    expect(() => new InfoReply(payload3)).toThrowError(InfoReply.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content example',
      owner: 'user-123'
    }

    // Action
    const { id, content, owner } = new InfoReply(payload)

    // Assert
    expect(id).toBe(payload.id)
    expect(content).toBe(payload.content)
    expect(owner).toBe(payload.owner)
  })
})
