const ClientErrorAbstract = require('../ClientErrorAbstract')

describe('ClientErrorAbstract', () => {
  it('It throws an error on direct instantiation', () => {
    expect(() => new ClientErrorAbstract()).toThrowError(ClientErrorAbstract.ERROR.ABSTRACT_INSTATIATION)
  })

  it('It allows the child class get instantiated', () => {
    // Arrange
    class StubClientError extends ClientErrorAbstract {}

    // Action & Assert
    expect(() => new StubClientError()).not.toThrowError(ClientErrorAbstract.ERROR.ABSTRACT_INSTATIATION)
  })
})
