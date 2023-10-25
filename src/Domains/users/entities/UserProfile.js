module.exports = class UserProfile {
  constructor (payload) {
    const { id, username, fullname } = UserProfile.preparePayload(payload)

    this.id = id
    this.username = username
    this.fullname = fullname
  }

  static ERROR = {
    INCOMPLETE_PAYLOAD: new Error('USER_PROFILE.INCOMPLETE_PAYLOAD'),
    INVALID_TYPE: new Error('USER_PROFILE.INVALID_TYPE')
  }

  static preparePayload (payload) {
    if (payload === null || [payload.id, payload.fullname, payload.username].includes(undefined)) {
      throw UserProfile.ERROR.INCOMPLETE_PAYLOAD
    }

    const { id, fullname, username } = payload

    if (typeof id !== 'string') throw UserProfile.ERROR.INVALID_TYPE
    if (typeof fullname !== 'string') throw UserProfile.ERROR.INVALID_TYPE
    if (typeof username !== 'string') throw UserProfile.ERROR.INVALID_TYPE

    return payload
  }
}
