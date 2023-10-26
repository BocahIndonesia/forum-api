const Handler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'threads',
  register: async function (server, { container }) {
    server.route(routes(new Handler(container)))
  }
}
