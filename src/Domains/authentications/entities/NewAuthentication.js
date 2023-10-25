module.exports = class NewAuthentication {
  constructor (payload) {
    const { accessToken, refreshToken } = NewAuthentication.preparePayload(payload)

    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('NEW_AUTHENTICATION.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('NEW_AUTHENTICATION.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.refreshToken, payload.accessToken].includes(undefined)) {
      throw NewAuthentication.ERROR.INCOMPLETE_PAYLOAD
    }

    const { accessToken, refreshToken } = payload

    if (typeof accessToken !== 'string') throw NewAuthentication.ERROR.INVALID_TYPE
    if (typeof refreshToken !== 'string') throw NewAuthentication.ERROR.INVALID_TYPE

    return payload
  }
}
