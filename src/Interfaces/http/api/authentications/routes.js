module.exports = function (handler) {
  return [
    {
      method: 'POST',
      path: '/authentications',
      handler: handler.login
    },
    {
      method: 'DELETE',
      path: '/authentications',
      handler: handler.logout
    },
    {
      method: 'PUT',
      path: '/authentications',
      handler: handler.refreshAuthentication
    }
  ]
}
