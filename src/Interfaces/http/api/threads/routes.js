module.exports = function (handler) {
  return [
    {
      method: 'POST',
      path: '/threads',
      handler: handler.add
    },
    {
      method: 'GET',
      path: '/threads/{threadId}',
      handler: handler.getDetailed
    }
  ]
}
