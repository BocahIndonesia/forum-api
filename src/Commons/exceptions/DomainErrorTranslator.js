const InvariantError = require('../exceptions/InvariantError')
const UserRegistration = require('../../Domains/users/entities/UserRegistration')
const UserLogin = require('../../Domains/users/entities/UserLogin')
const RefreshToken = require('../../Domains/authentications/entities/RefreshToken')
const NewThread = require('../../Domains/threads/entities/NewThread')
const NewComment = require('../../Domains/comments/entities/NewComment')
const NewReply = require('../../Domains/replies/entities/NewReply')

const maps = {
  [UserRegistration.ERROR.INCOMPLETE_PAYLOAD.message]: 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  [UserRegistration.ERROR.INVALID_TYPE.message]: 'tidak dapat membuat user baru karena tipe data tidak sesuai',
  [UserRegistration.ERROR.USERNAME_LENGTH_OFFSET.message]: 'tidak dapat membuat user baru karena karakter username melebihi batas limit',
  [UserRegistration.ERROR.USERNAME_CONTAINS_FORBIDEN_CHARS.message]: 'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  [UserLogin.ERROR.INCOMPLETE_PAYLOAD.message]: 'harus mengirimkan username dan password',
  [UserLogin.ERROR.INVALID_TYPE.message]: 'username dan password harus string',
  [RefreshToken.ERROR.INCOMPLETE_PAYLOAD.message]: 'harus mengirimkan token refresh',
  [RefreshToken.ERROR.INVALID_TYPE.message]: 'refresh token harus string',
  [NewThread.ERROR.INCOMPLETE_PAYLOAD.message]: 'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
  [NewThread.ERROR.INVALID_TYPE.message]: 'tidak dapat membuat thread baru karena tipe data tidak sesuai',
  [NewComment.ERROR.INCOMPLETE_PAYLOAD.message]: 'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada',
  [NewComment.ERROR.INVALID_TYPE.message]: 'tidak dapat membuat comment baru karena tipe data tidak sesuai',
  [NewReply.ERROR.INCOMPLETE_PAYLOAD.message]: 'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada',
  [NewReply.ERROR.INVALID_TYPE.message]: 'tidak dapat membuat reply baru karena tipe data tidak sesuai'
}

module.exports = {
  maps,
  translate (error) {
    if (Object.keys(maps).includes(error.message)) {
      return new InvariantError(maps[error.message])
    }
    return error
  }
}
