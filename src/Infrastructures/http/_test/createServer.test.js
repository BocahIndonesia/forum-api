const container = require('../../container')
const createServer = require('../createServer')

describe('HTTP server', () => {
  let server, response

  it('responds a 404 on an unregistered route', async () => {
    // Assert
    server = await createServer(container)

    // Action
    response = await server.inject({
      method: 'GET',
      url: '/non-exist-route/lol'
    })

    // Assert
    expect(response.statusCode).toBe(404)
  })

  it('responds a 500 if a failure happens in the server', async () => {
    // Arrange
    const payload = {
      username: 'user123',
      fullname: 'user test',
      password: 'supersecret'
    }
    server = await createServer({})

    // Action
    response = await server.inject({
      method: 'POST',
      url: '/users',
      payload
    })

    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toBe(500)
    expect(responseJson.status).toBe('error')
    expect(responseJson.message).toBe('terjadi kegagalan pada server kami')
  })
})
