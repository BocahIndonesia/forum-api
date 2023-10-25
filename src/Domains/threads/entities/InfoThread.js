module.exports = class InfoThread {
  constructor (payload) {
    const { id, title, owner } = InfoThread.preparePayload(payload)

    this.id = id
    this.title = title
    this.owner = owner
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('INFO_THREAD.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('INFO_THREAD.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.title, payload.owner].includes(undefined)) {
      throw InfoThread.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, title, owner } = payload

    if (typeof id !== 'string') throw InfoThread.ERROR.INVALID_TYPE
    if (typeof title !== 'string') throw InfoThread.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw InfoThread.ERROR.INVALID_TYPE

    return payload
  }
}
