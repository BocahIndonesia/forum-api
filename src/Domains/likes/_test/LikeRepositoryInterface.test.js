const LikeRepositoryInterface = require('../LikeRepositoryInterface')

describe('LikeRepositoryInterface', () => {
  it('Instantiation throws an error on direct instantiation', () => {
    expect(() => new LikeRepositoryInterface()).toThrowError(LikeRepositoryInterface.ERROR.ABSTRACT_INSTATIATION)
  })

  // Arrange
  class StubLikeRepository extends LikeRepositoryInterface {}
  const stubLikeRepository = new StubLikeRepository()

  describe('add', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubLikeRepository.add({})).rejects.toThrowError(LikeRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('delete', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubLikeRepository.delete({})).rejects.toThrowError(LikeRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyExist', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubLikeRepository.verifyExist({})).rejects.toThrowError(LikeRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('selectByCommentId', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubLikeRepository.selectByCommentId('')).rejects.toThrowError(LikeRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })
})
