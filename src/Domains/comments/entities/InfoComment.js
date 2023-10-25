module.exports = class InfoComment {
  constructor (payload) {
    const { id, content, owner } = InfoComment.preparePayload(payload)

    this.id = id
    this.content = content
    this.owner = owner
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('INFO_COMMENT.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('INFO_COMMENT.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.content, payload.owner].includes(undefined)) {
      throw InfoComment.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, content, owner } = payload

    if (typeof id !== 'string') throw InfoComment.ERROR.INVALID_TYPE
    if (typeof content !== 'string') throw InfoComment.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw InfoComment.ERROR.INVALID_TYPE

    return payload
  }
}
