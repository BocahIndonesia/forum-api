const ClientErrorAbstract = require('./ClientErrorAbstract')

module.exports = class extends ClientErrorAbstract {
  constructor (message) {
    super(message, 404)
  }
}
