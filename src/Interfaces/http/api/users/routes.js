module.exports = function (handler) {
  return [
    {
      method: 'POST',
      path: '/users',
      handler: handler.register
    }
  ]
}
