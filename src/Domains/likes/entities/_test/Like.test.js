const Like = require('../Like')

describe('Like', () => {
  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      comment: 'comment-123'
    }
    const payload2 = null

    // Action & Assert
    expect(() => new Like(payload)).toThrowError(Like.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new Like(payload2)).toThrowError(Like.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      comment: 123,
      owner: 'user-123'
    }
    const payload2 = {
      comment: 'comment-123',
      owner: 123
    }

    // Action & Assert
    expect(() => new Like(payload)).toThrowError(Like.ERROR.INVALID_TYPE)
    expect(() => new Like(payload2)).toThrowError(Like.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload = {
      comment: 'comment-123',
      owner: 'user-123'
    }

    // Action
    const { comment, owner } = new Like(payload)

    // Assert
    expect(comment).toBe(payload.comment)
    expect(owner).toBe(payload.owner)
  })
})
