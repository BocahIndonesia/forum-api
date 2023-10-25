module.exports = class Thread {
  constructor (payload) {
    const { id, title, body, owner, date } = Thread.preparePayload(payload)

    this.id = id
    this.title = title
    this.body = body
    this.owner = owner
    this.date = date
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('THREAD.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('THREAD.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.title, payload.body, payload.owner, payload.date].includes(undefined)) {
      throw Thread.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, title, body, owner, date } = payload

    if (typeof id !== 'string') throw Thread.ERROR.INVALID_TYPE
    if (typeof title !== 'string') throw Thread.ERROR.INVALID_TYPE
    if (typeof body !== 'string') throw Thread.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw Thread.ERROR.INVALID_TYPE
    if (!(date instanceof Date)) throw Thread.ERROR.INVALID_TYPE

    return payload
  }
}
