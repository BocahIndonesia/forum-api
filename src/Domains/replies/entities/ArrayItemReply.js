module.exports = class ArrayItemReply {
  constructor (payload) {
    const { id, content, date, username, isDelete } = ArrayItemReply.preparePayload(payload)

    this.id = id
    this.content = isDelete ? '**balasan telah dihapus**' : content
    this.date = date.toISOString()
    this.username = username
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('ARRAY_ITEM_REPLY.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('ARRAY_ITEM_REPLY.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.content, payload.isDelete, payload.username, payload.date].includes(undefined)) {
      throw ArrayItemReply.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, username, date, content, isDelete } = payload

    if (typeof id !== 'string') throw ArrayItemReply.ERROR.INVALID_TYPE
    if (typeof username !== 'string') throw ArrayItemReply.ERROR.INVALID_TYPE
    if (!(date instanceof Date)) throw ArrayItemReply.ERROR.INVALID_TYPE
    if (typeof content !== 'string') throw ArrayItemReply.ERROR.INVALID_TYPE
    if (typeof isDelete !== 'boolean') throw ArrayItemReply.ERROR.INVALID_TYPE

    return payload
  }
}
