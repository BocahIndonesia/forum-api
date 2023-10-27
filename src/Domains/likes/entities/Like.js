module.exports = class Like {
  constructor (payload) {
    const { owner, comment } = Like.preparePayload(payload)

    this.comment = comment
    this.owner = owner
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('TOGGLE_LIKE.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('TOGGLE_LIKE.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.comment, payload.owner].includes(undefined)) {
      throw Like.ERROR.INCOMPLETE_PAYLOAD
    }

    const { comment, owner } = payload

    if (typeof comment !== 'string') throw Like.ERROR.INVALID_TYPE
    if (typeof owner !== 'string') throw Like.ERROR.INVALID_TYPE

    return payload
  }
}
