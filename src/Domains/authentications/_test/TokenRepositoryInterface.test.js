const TokenRepositoryInterface = require('../TokenRepositoryInterface')

describe('TokenRepositoryInterface', () => {
  it('Instantiation throws an error on direct instantiation', () => {
    expect(() => new TokenRepositoryInterface()).toThrowError(TokenRepositoryInterface.ERROR.ABSTRACT_INSTANTIATION)
  })

  // Arrange
  class StubTokenRepository extends TokenRepositoryInterface {}
  const stubTokenRepository = new StubTokenRepository()

  describe('add', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubTokenRepository.add('')).rejects.toThrowError(TokenRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })

  describe('delete', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubTokenRepository.delete('')).rejects.toThrowError(TokenRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyExistByToken', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubTokenRepository.verifyExistByToken('')).rejects.toThrowError(TokenRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })
})
