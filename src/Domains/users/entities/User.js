module.exports = class User {
  constructor (payload) {
    const { id, username, fullname, password } = User.preparePayload(payload)

    this.id = id
    this.username = username
    this.fullname = fullname
    this.password = password
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('USER.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('USER.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.fullname, payload.username, payload.password].includes(undefined)) {
      throw User.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, fullname, username, password } = payload

    if (typeof id !== 'string') throw User.ERROR.INVALID_TYPE
    if (typeof fullname !== 'string') throw User.ERROR.INVALID_TYPE
    if (typeof username !== 'string') throw User.ERROR.INVALID_TYPE
    if (typeof password !== 'string') throw User.ERROR.INVALID_TYPE

    return payload
  }
}
