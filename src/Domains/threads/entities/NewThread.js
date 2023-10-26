module.exports = class Thread {
  constructor (payload) {
    const { title, body, owner } = Thread.preparePayload(payload)

    this.title = title
    this.body = body
    this.owner = owner
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('NEW_THREAD.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('NEW_THREAD.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.title, payload.body, payload.owner].includes(undefined)) {
      throw Thread.ERROR.INCOMPLETE_PAYLOAD
    }

    const { title, body, owner } = payload

    if (typeof title !== 'string') throw Thread.ERROR.INVALID_TYPE
    if (typeof body !== 'string') throw Thread.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw Thread.ERROR.INVALID_TYPE

    return payload
  }
}
