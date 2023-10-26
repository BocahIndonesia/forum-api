const InfoComment = require('../InfoComment')

describe('InfoComment', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new InfoComment(payload)).toThrowError(InfoComment.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new InfoComment(payload2)).toThrowError(InfoComment.ERROR.INCOMPLETE_PAYLOAD)
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
      content: 234,
      owner: 'user-123'
    }
    const payload3 = {
      id: 'comment-123',
      content: 'content example',
      owner: 123
    }

    // Action & Assert
    expect(() => new InfoComment(payload)).toThrowError(InfoComment.ERROR.INVALID_TYPE)
    expect(() => new InfoComment(payload2)).toThrowError(InfoComment.ERROR.INVALID_TYPE)
    expect(() => new InfoComment(payload3)).toThrowError(InfoComment.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content example',
      owner: 'user-123'
    }

    // Action
    const { id, content, owner } = new InfoComment(payload)

    // Assert
    expect(id).toBe(payload.id)
    expect(content).toBe(payload.content)
    expect(owner).toBe(payload.owner)
  })
})
