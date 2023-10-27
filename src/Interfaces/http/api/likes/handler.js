const LikeUseCase = require('../../../../Applications/use_cases/LikeUseCase')
const JwtManager = require('../../../../Infrastructures/security/JwtManager')

module.exports = class {
  constructor (container) {
    this._container = container

    this.toggle = this.toggle.bind(this)
  }

  async toggle (request, h) {
    const { threadId, commentId } = request.params
    const accessToken = JwtManager.extractAccessTokenFromBearer(request.headers.authorization)
    const likeUseCase = this._container.getInstance(LikeUseCase.name)

    await likeUseCase.toggle(accessToken, { threadId, commentId })

    return h.response({
      status: 'success'
    })
  }
}
