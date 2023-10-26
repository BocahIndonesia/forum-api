module.exports = class UserRegistration {
  constructor (payload) {
    const { username, fullname, password } = UserRegistration.preparePayload(payload)

    this.username = username
    this.fullname = fullname
    this.password = password
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('USER_REGISTRATION.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('USER_REGISTRATION.INVALID_TYPE'),
    USERNAME_LENGTH_OFFSET: new Error('USER_REGISTRATION.USERNAME_LENGTH_OFFSET'),
    USERNAME_CONTAINS_FORBIDEN_CHARS: new Error('USER_REGISTRATION.USERNAME_CONTAINS_FORBIDEN_CHARS')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.fullname, payload.username, payload.password].includes(undefined)) {
      throw UserRegistration.ERROR.INCOMPLETE_PAYLOAD
    }

    const { fullname, username, password } = payload

    if (typeof fullname !== 'string') throw UserRegistration.ERROR.INVALID_TYPE
    if (typeof username !== 'string') throw UserRegistration.ERROR.INVALID_TYPE
    if (username.length > 50) throw UserRegistration.ERROR.USERNAME_LENGTH_OFFSET
    if (!username.match(/^\w+$/)) throw UserRegistration.ERROR.USERNAME_CONTAINS_FORBIDEN_CHARS
    if (typeof password !== 'string') throw UserRegistration.ERROR.INVALID_TYPE

    return payload
  }
}
