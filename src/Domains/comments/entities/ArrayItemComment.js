module.exports = class ArrayItemComment {
  constructor (payload) {
    const { id, username, date, content, isDelete, replies, likeCount } = ArrayItemComment.preparePayload(payload)

    this.id = id
    this.username = username
    this.date = date.toISOString()
    this.content = isDelete ? '**komentar telah dihapus**' : content
    this.replies = replies
    this.likeCount = likeCount
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('ARRAY_ITEM_COMMENT.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('ARRAY_ITEM_COMMENT.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.content, payload.isDelete, payload.username, payload.date, payload.replies, payload.likeCount].includes(undefined)) {
      throw ArrayItemComment.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, username, date, content, isDelete, replies, likeCount } = payload

    if (typeof id !== 'string') throw ArrayItemComment.ERROR.INVALID_TYPE
    if (typeof username !== 'string') throw ArrayItemComment.ERROR.INVALID_TYPE
    if (!(date instanceof Date)) throw ArrayItemComment.ERROR.INVALID_TYPE
    if (typeof content !== 'string') throw ArrayItemComment.ERROR.INVALID_TYPE
    if (typeof isDelete !== 'boolean') throw ArrayItemComment.ERROR.INVALID_TYPE
    if (!Array.isArray(replies)) throw ArrayItemComment.ERROR.INVALID_TYPE
    if (typeof likeCount !== 'number') throw ArrayItemComment.ERROR.INVALID_TYPE

    return payload
  }
}
