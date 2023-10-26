module.exports = class DetailedThread {
  constructor (payload) {
    const { id, title, body, date, username, comments } = DetailedThread.preparePayload(payload)

    this.id = id
    this.title = title
    this.body = body
    this.date = date.toISOString()
    this.username = username
    this.comments = comments
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('DETAILED_THREAD.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('DETAILED_THREAD.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.title, payload.body, payload.date, payload.username, payload.comments].includes(undefined)) {
      throw DetailedThread.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, title, body, date, username, comments } = payload

    if (typeof id !== 'string') throw DetailedThread.ERROR.INVALID_TYPE
    if (typeof title !== 'string') throw DetailedThread.ERROR.INVALID_TYPE
    if (typeof body !== 'string') throw DetailedThread.ERROR.INVALID_TYPE
    if (!(date instanceof Date)) throw DetailedThread.ERROR.INVALID_TYPE
    if (typeof username !== 'string') throw DetailedThread.ERROR.INVALID_TYPE
    if (!Array.isArray(comments)) throw DetailedThread.ERROR.INVALID_TYPE

    return payload
  }
}
