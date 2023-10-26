const PasswordHashInterface = require('../PasswordHashInterface')

describe('PasswordHashInterface', () => {
  it('Instantiation throws an error on direct instantiation', () => {
    expect(() => new PasswordHashInterface()).toThrowError(PasswordHashInterface.ERROR.ABSTRACT_INSTATIATION)
  })

  // Arrange
  class StubPasswordHash extends PasswordHashInterface {}
  const stubPasswordHash = new StubPasswordHash()

  describe('hash', () => {
    it('It throws an error if method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubPasswordHash.hash('')).rejects.toThrowError(PasswordHashInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })

  describe('compare', () => {
    it('It throws an error if method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubPasswordHash.compare('', '')).rejects.toThrowError(PasswordHashInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })
})
