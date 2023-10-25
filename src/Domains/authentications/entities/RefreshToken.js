module.exports = class RefreshToken {
  constructor (payload) {
    const { token } = RefreshToken.preparePayload(payload)

    this.token = token
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('REFRESH_TOKEN.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('REFRESH_TOKEN.INVALID_TYPE')
  }

  static preparePayload (payload) {
    // Payload must contain field token
    if (payload === null || [payload.token].includes(undefined)) {
      throw RefreshToken.ERROR.INCOMPLETE_PAYLOAD
    }

    const { token } = payload

    if (typeof token !== 'string') throw RefreshToken.ERROR.INVALID_TYPE

    return payload
  }
}
