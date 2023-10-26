module.exports = function (handler) {
  return [
    {
      method: 'POST',
      path: '/threads/{threadId}/comments',
      handler: handler.add
    },
    {
      method: 'DELETE',
      path: '/threads/{threadId}/comments/{commentId}',
      handler: handler.delete
    }
  ]
}
