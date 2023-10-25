module.exports = class Reply {
  constructor (payload) {
    const { id, content, isDelete, owner, comment, date } = Reply.preparePayload(payload)

    this.id = id
    this.content = content
    this.isDelete = isDelete
    this.owner = owner
    this.comment = comment
    this.date = date
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('REPLY.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('REPLY.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.content, payload.isDelete, payload.owner, payload.comment, payload.date].includes(undefined)) {
      throw Reply.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, content, isDelete, owner, comment, date } = payload

    if (typeof id !== 'string') throw Reply.ERROR.INVALID_TYPE
    if (typeof content !== 'string') throw Reply.ERROR.INVALID_TYPE
    if (typeof isDelete !== 'boolean') throw Reply.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw Reply.ERROR.INVALID_TYPE
    if (typeof comment !== 'string') throw Reply.ERROR.INVALID_TYPE
    if (!(date instanceof Date)) throw Reply.ERROR.INVALID_TYPE

    return payload
  }
}
