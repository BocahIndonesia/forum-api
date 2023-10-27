require('dotenv').config()
const Hapi = require('@hapi/hapi')
const users = require('../../Interfaces/http/api/users')
const authentications = require('../../Interfaces/http/api/authentications')
const threads = require('../../Interfaces/http/api/threads')
const comments = require('../../Interfaces/http/api/comments')
const replies = require('../../Interfaces/http/api/replies')
const likes = require('../../Interfaces/http/api/likes')
const ClientErrorAbstract = require('../../Commons/exceptions/ClientErrorAbstract')
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator')

async function createServer (container) {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  })

  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
      options: { container }
    },
    {
      plugin: threads,
      options: { container }
    },
    {
      plugin: comments,
      options: { container }
    },
    {
      plugin: replies,
      options: { container }
    },
    {
      plugin: likes,
      options: { container }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response)

      if (translatedError instanceof ClientErrorAbstract) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        })
        newResponse.code(translatedError.code)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      return newResponse
    }

    return h.continue
  })

  return server
}

module.exports = createServer
