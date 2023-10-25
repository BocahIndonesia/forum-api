module.exports = class DetailedComment {
  constructor (payload) {
    const { id, username, date, replies, content } = DetailedComment.preparePayload(payload)

    this.id = id
    this.username = username
    this.date = date
    this.replies = replies
    this.content = content
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('COMMENT.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('COMMENT.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.content, payload.username, payload.owner, payload.replies].includes(undefined)) {
      throw DetailedComment.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, content, username, owner, replies } = payload

    if (typeof id !== 'string') throw DetailedComment.ERROR.INVALID_TYPE
    if (typeof content !== 'string') throw DetailedComment.ERROR.INVALID_TYPE
    if (typeof username !== 'boolean') throw DetailedComment.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw DetailedComment.ERROR.INVALID_TYPE
    if (typeof replies !== 'string') throw DetailedComment.ERROR.INVALID_TYPE

    return payload
  }
}
