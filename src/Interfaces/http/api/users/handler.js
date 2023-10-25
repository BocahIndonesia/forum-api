const UserUseCase = require('../../../../Applications/use_cases/UserUseCase')

module.exports = class {
  constructor (container) {
    this._container = container
    this.register = this.register.bind(this)
  }

  async register (request, h) {
    const { fullname = undefined, username = undefined, password = undefined } = request.payload ?? {}
    const userUseCase = this._container.getInstance(UserUseCase.name)
    const userProfile = await userUseCase.register({ fullname, username, password })

    return h.response({
      status: 'success',
      data: {
        addedUser: userProfile
      }
    }).code(201)
  }
}
