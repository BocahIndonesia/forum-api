const CommentUseCase = require('../../../../Applications/use_cases/CommentUseCase')
const JwtManager = require('../../../../Infrastructures/security/JwtManager')

module.exports = class {
  constructor (container) {
    this._container = container

    this.add = this.add.bind(this)
    this.delete = this.delete.bind(this)
  }

  async add (request, h) {
    const { threadId } = request.params
    const { content: commentContent = undefined } = request.payload ?? {}
    const commentUseCase = this._container.getInstance(CommentUseCase.name)
    const accessToken = JwtManager.extractAccessTokenFromBearer(request.headers.authorization)
    const infoComment = await commentUseCase.add(accessToken, { commentContent, threadId })

    return h.response({
      status: 'success',
      data: {
        addedComment: infoComment
      }
    }).code(201)
  }

  async delete (request, h) {
    const { threadId, commentId } = request.params
    const commentUseCase = this._container.getInstance(CommentUseCase.name)
    const accessToken = JwtManager.extractAccessTokenFromBearer(request.headers.authorization)

    await commentUseCase.delete(accessToken, { threadId, commentId })

    return h.response({
      status: 'success'
    }).code(200)
  }
}
