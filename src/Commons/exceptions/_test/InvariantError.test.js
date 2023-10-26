const InvariantError = require('../InvariantError')

describe('InvariantError', () => {
  it('instantiates InvariantError', () => {
    // Assert
    const errorMsg = 'Invariant error'

    // Action
    const { name, code, message } = new InvariantError(errorMsg)

    // Assert
    expect(name).toEqual(InvariantError.name)
    expect(code).toEqual(400)
    expect(message).toEqual(errorMsg)
  })
})
