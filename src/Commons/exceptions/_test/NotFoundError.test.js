const NotFoundError = require('../NotFoundError')

describe('NotFoundError', () => {
  it('instantiates NotFoundError', () => {
    // Arrange
    const errorMsg = 'NotFound error'

    // Action
    const { name, code, message } = new NotFoundError(errorMsg)

    // Arrange
    expect(name).toEqual(NotFoundError.name)
    expect(code).toEqual(404)
    expect(message).toEqual(errorMsg)
  })
})
