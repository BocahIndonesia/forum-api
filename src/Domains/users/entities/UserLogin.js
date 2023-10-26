module.exports = class UserLogin {
  constructor (payload) {
    const { username, password } = UserLogin.preparePayload(payload)

    this.username = username
    this.password = password
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('USER_LOGIN.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('USER_LOGIN.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.username, payload.password].includes(undefined)) {
      throw UserLogin.ERROR.INCOMPLETE_PAYLOAD
    }

    const { username, password } = payload

    if (typeof username !== 'string') throw UserLogin.ERROR.INVALID_TYPE
    if (typeof password !== 'string') throw UserLogin.ERROR.INVALID_TYPE

    return payload
  }
}
