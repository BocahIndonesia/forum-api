module.exports = class Comment {
  constructor (payload) {
    const { id, content, isDelete, owner, thread, date } = Comment.preparePayload(payload)

    this.id = id
    this.content = content
    this.isDelete = isDelete
    this.owner = owner
    this.thread = thread
    this.date = date
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('COMMENT.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('COMMENT.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.content, payload.isDelete, payload.owner, payload.thread, payload.date].includes(undefined)) {
      throw Comment.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, content, isDelete, owner, thread, date } = payload

    if (typeof id !== 'string') throw Comment.ERROR.INVALID_TYPE
    if (typeof content !== 'string') throw Comment.ERROR.INVALID_TYPE
    if (typeof isDelete !== 'boolean') throw Comment.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw Comment.ERROR.INVALID_TYPE
    if (typeof thread !== 'string') throw Comment.ERROR.INVALID_TYPE
    if (!(date instanceof Date)) throw Comment.ERROR.INVALID_TYPE

    return payload
  }
}
