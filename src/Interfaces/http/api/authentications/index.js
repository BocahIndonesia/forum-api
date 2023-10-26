const Handler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'authentications',
  register: async function (server, { container }) {
    server.route(routes(new Handler(container)))
  }
}
