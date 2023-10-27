module.exports = function (handler) {
  return [
    {
      method: 'PUT',
      path: '/threads/{threadId}/comments/{commentId}/likes',
      handler: handler.toggle
    }
  ]
}
