module.exports = class NewComment {
  constructor (payload) {
    const { content, owner, comment } = NewComment.preparePayload(payload)

    this.content = content
    this.owner = owner
    this.comment = comment
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('NEW_REPLY.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('NEW_REPLY.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.content, payload.owner, payload.comment].includes(undefined)) {
      throw NewComment.ERROR.INCOMPLETE_PAYLOAD
    }

    const { content, owner, comment } = payload

    if (typeof content !== 'string') throw NewComment.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw NewComment.ERROR.INVALID_TYPE
    if (typeof comment !== 'string') throw NewComment.ERROR.INVALID_TYPE

    return payload
  }
}
