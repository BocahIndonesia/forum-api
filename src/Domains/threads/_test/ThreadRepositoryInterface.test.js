const ThreadRepositoryInterface = require('../ThreadRepositoryInterface')

describe('ThreadRepositoryInterface', () => {
  it('Instantiation throws an error on direct instantiation', () => {
    expect(() => new ThreadRepositoryInterface()).toThrowError(ThreadRepositoryInterface.ERROR.ABSTRACT_INSTATIATION)
  })

  // Arrange
  class StubThreadRepository extends ThreadRepositoryInterface {}
  const stubThreadRepository = new StubThreadRepository()

  describe('add', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubThreadRepository.add({})).rejects.toThrowError(ThreadRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyExistById', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubThreadRepository.verifyExistById('')).rejects.toThrowError(ThreadRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('getDetailedById', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubThreadRepository.getDetailedById('')).rejects.toThrowError(ThreadRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })
})
