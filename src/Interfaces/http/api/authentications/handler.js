const AuthenticationUseCase = require('../../../../Applications/use_cases/AuthenticationUseCase')

module.exports = class {
  constructor (container) {
    this._container = container
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.refreshAuthentication = this.refreshAuthentication.bind(this)
  }

  async login (request, h) {
    const { username = undefined, password = undefined } = request.payload ?? {}
    const authenticationUseCase = this._container.getInstance(AuthenticationUseCase.name)
    const newAuthentication = await authenticationUseCase.login({ username, password })

    return h.response({
      status: 'success',
      data: {
        ...newAuthentication
      }
    }).code(201)
  }

  async logout (request, h) {
    const authenticationUseCase = this._container.getInstance(AuthenticationUseCase.name)
    await authenticationUseCase.logout(request.payload)

    return h.response({
      status: 'success'
    })
  }

  async refreshAuthentication (request, h) {
    const authenticationUseCase = this._container.getInstance(AuthenticationUseCase.name)
    const accessToken = await authenticationUseCase.refreshAuthentication(request.payload)

    return h.response({
      status: 'success',
      data: {
        accessToken
      }
    })
  }
}
