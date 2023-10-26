const UserRepositoryInterface = require('../../Domains/users/UserRepositoryInterface')
const PasswordHashInterface = require('../security/PasswordHashInterface')
const UserRegistration = require('../../Domains/users/entities/UserRegistration')
const UserProfile = require('../../Domains/users/entities/UserProfile')

module.exports = class UserUseCase {
  constructor (dependencies) {
    const { userRepository, passwordHash } = UserUseCase.prepareDependencies(dependencies)

    this._userRepository = userRepository
    this._passwordHash = passwordHash
  }

  static ERROR = {
    INVALID_USER_REPOSITORY: new Error('USER_USE_CASE.DOES_NOT_IMPLEMENT_USER_REPOSITORY_INTERFACE'),
    INVALID_PASSWORD_HASH: new Error('USER_USE_CASE.DOES_NOT_IMPLEMENT_PASSWORD_HASH_INTERFACE')
  }

  static prepareDependencies (dependencies) {
    const { userRepository, passwordHash } = dependencies

    if (!(userRepository instanceof UserRepositoryInterface)) throw UserUseCase.ERROR.INVALID_USER_REPOSITORY
    if (!(passwordHash instanceof PasswordHashInterface)) throw UserUseCase.ERROR.INVALID_PASSWORD_HASH

    return dependencies
  }

  async register (payload) {
    const { username, fullname, password } = new UserRegistration(payload)

    await this._userRepository.verifyUsernameAvailibility(username)

    const hashedPassword = await this._passwordHash.hash(password)
    const user = await this._userRepository.register({
      username,
      fullname,
      password: hashedPassword
    })

    return new UserProfile(user)
  }
}
