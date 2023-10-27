const ArrayItemComment = require('../ArrayItemComment')

describe('ArrayItemComment', () => {
  const now = new Date()

  it('Instantiation throws an error on incomplete/empty payload', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: now,
      isDelete: false,
      replies: [],
      likeCount: 1
    }
    const payload2 = null

    // Action & Assert
    expect(() => new ArrayItemComment(payload)).toThrowError(ArrayItemComment.ERROR.INCOMPLETE_PAYLOAD)
    expect(() => new ArrayItemComment(payload2)).toThrowError(ArrayItemComment.ERROR.INCOMPLETE_PAYLOAD)
  })

  it('Instantiation throws an error on atleast one field with wrong data type', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: false,
      replies: [],
      likeCount: 1
    }
    const payload2 = {
      id: 'comment-123',
      username: 123,
      date: now,
      content: 'content example',
      isDelete: false,
      replies: [],
      likeCount: 1
    }
    const payload3 = {
      id: 'comment-123',
      username: 'user-123',
      date: 123,
      content: 'content example',
      isDelete: false,
      replies: [],
      likeCount: 1
    }
    const payload4 = {
      id: 'comment-123',
      username: 'user-123',
      date: now,
      content: 123,
      isDelete: false,
      replies: [],
      likeCount: 1
    }
    const payload5 = {
      id: 'comment-123',
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: 123,
      replies: [],
      likeCount: 1
    }
    const payload6 = {
      id: 'comment-123',
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: false,
      replies: 123,
      likeCount: 1
    }
    const payload7 = {
      id: 'comment-123',
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: false,
      replies: [],
      likeCount: 'lol'
    }

    // Action & Assert
    expect(() => new ArrayItemComment(payload)).toThrowError(ArrayItemComment.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemComment(payload2)).toThrowError(ArrayItemComment.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemComment(payload3)).toThrowError(ArrayItemComment.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemComment(payload4)).toThrowError(ArrayItemComment.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemComment(payload5)).toThrowError(ArrayItemComment.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemComment(payload6)).toThrowError(ArrayItemComment.ERROR.INVALID_TYPE)
    expect(() => new ArrayItemComment(payload7)).toThrowError(ArrayItemComment.ERROR.INVALID_TYPE)
  })

  it('Instantiate correctly on valid payload', () => {
    // Arrange
    const payload1 = {
      id: 'comment-123',
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: false,
      replies: [],
      likeCount: 1
    }
    const payload2 = {
      id: 'comment-123',
      username: 'user-123',
      date: now,
      content: 'content example',
      isDelete: true,
      replies: [],
      likeCount: 1
    }

    // Action
    const itemComment1 = new ArrayItemComment(payload1)
    const itemComment2 = new ArrayItemComment(payload2)

    // Assert
    expect(itemComment1.id).toBe(payload1.id)
    expect(itemComment1.username).toBe(payload1.username)
    expect(itemComment1.date).toBe(payload1.date.toISOString())
    expect(itemComment1.content).toBe(payload1.content)
    expect(itemComment1.replies).toHaveLength(0)
    expect(itemComment1.likeCount).toBe(payload1.likeCount)
    expect(itemComment2.id).toBe(payload2.id)
    expect(itemComment2.username).toBe(payload2.username)
    expect(itemComment2.date).toBe(payload2.date.toISOString())
    expect(itemComment2.content).toBe('**komentar telah dihapus**')
    expect(itemComment2.replies).toHaveLength(0)
    expect(itemComment2.likeCount).toBe(payload2.likeCount)
  })
})
