require('dotenv').config()
const createServer = require('./Infrastructures/http/createServer')
const container = require('./Infrastructures/container')

async function start () {
  const server = await createServer(container)
  await server.start()
  console.log(`Server start at ${server.info.uri}`)
}

start()
