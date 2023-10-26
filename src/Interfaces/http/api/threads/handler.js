const ThreadUseCase = require('../../../../Applications/use_cases/ThreadUseCase')
const JwtManager = require('../../../../Infrastructures/security/JwtManager')

module.exports = class {
  constructor (container) {
    this._container = container

    this.add = this.add.bind(this)
    this.getDetailed = this.getDetailed.bind(this)
  }

  async add (request, h) {
    const { title = undefined, body = undefined } = request.payload ?? {}
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const accessToken = JwtManager.extractAccessTokenFromBearer(request.headers.authorization)
    const infoThread = await threadUseCase.add(accessToken, { threadTitle: title, threadBody: body })

    return h.response({
      status: 'success',
      data: {
        addedThread: infoThread
      }
    }).code(201)
  }

  async getDetailed (request, h) {
    const { threadId } = request.params
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const detailedThread = await threadUseCase.getDetailedById({ threadId })

    return h.response({
      status: 'success',
      data: {
        thread: detailedThread
      }
    })
  }
}
