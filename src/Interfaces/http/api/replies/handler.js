const ReplyUseCase = require('../../../../Applications/use_cases/ReplyUseCase')
const JwtManager = require('../../../../Infrastructures/security/JwtManager')

module.exports = class {
  constructor (container) {
    this._container = container

    this.add = this.add.bind(this)
    this.delete = this.delete.bind(this)
  }

  async add (request, h) {
    const { threadId, commentId } = request.params
    const { content: replyContent = undefined } = request.payload ?? {}
    const replyUseCase = this._container.getInstance(ReplyUseCase.name)
    const accessToken = JwtManager.extractAccessTokenFromBearer(request.headers.authorization)
    const infoReply = await replyUseCase.add(accessToken, { replyContent, threadId, commentId })

    return h.response({
      status: 'success',
      data: {
        addedReply: infoReply
      }
    }).code(201)
  }

  async delete (request, h) {
    const { threadId, commentId, replyId } = request.params
    const replyUseCase = this._container.getInstance(ReplyUseCase.name)
    const accessToken = JwtManager.extractAccessTokenFromBearer(request.headers.authorization)

    await replyUseCase.delete(accessToken, { threadId, commentId, replyId })

    return h.response({
      status: 'success'
    }).code(200)
  }
}
