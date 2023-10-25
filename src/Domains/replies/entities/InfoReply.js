module.exports = class InfoReply {
  constructor (payload) {
    const { id, content, owner } = InfoReply.preparePayload(payload)

    this.id = id
    this.content = content
    this.owner = owner
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('INFO_REPLY.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('INFO_REPLY.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.content, payload.owner].includes(undefined)) {
      throw InfoReply.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, content, owner } = payload

    if (typeof id !== 'string') throw InfoReply.ERROR.INVALID_TYPE
    if (typeof content !== 'string') throw InfoReply.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw InfoReply.ERROR.INVALID_TYPE

    return payload
  }
}
