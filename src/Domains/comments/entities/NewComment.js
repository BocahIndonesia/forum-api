module.exports = class NewComment {
  constructor (payload) {
    const { content, owner, thread } = NewComment.preparePayload(payload)

    this.content = content
    this.owner = owner
    this.thread = thread
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('NEW_COMMENT.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('NEW_COMMENT.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.content, payload.owner, payload.thread].includes(undefined)) {
      throw NewComment.ERROR.INCOMPLETE_PAYLOAD
    }

    const { content, owner, thread } = payload

    if (typeof content !== 'string') throw NewComment.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw NewComment.ERROR.INVALID_TYPE
    if (typeof thread !== 'string') throw NewComment.ERROR.INVALID_TYPE

    return payload
  }
}
