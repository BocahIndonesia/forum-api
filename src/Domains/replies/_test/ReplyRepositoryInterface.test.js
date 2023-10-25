const ReplyRepositoryInterface = require('../ReplyRepositoryInterface')

describe('ReplyRepositoryInterface', () => {
  it('Instantiation throws an error on direct instantiation', () => {
    expect(() => new ReplyRepositoryInterface()).toThrowError(ReplyRepositoryInterface.ERROR.ABSTRACT_INSTATIATION)
  })

  // Arrange
  class StubReplyRepository extends ReplyRepositoryInterface {}
  const stubReplyRepository = new StubReplyRepository()

  describe('add', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubReplyRepository.add({})).rejects.toThrowError(ReplyRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('softDeleteById', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubReplyRepository.softDeleteById({})).rejects.toThrowError(ReplyRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyExistById', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubReplyRepository.verifyExistById('')).rejects.toThrowError(ReplyRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyAccess', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubReplyRepository.verifyAccess({})).rejects.toThrowError(ReplyRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('selectByCommentId', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubReplyRepository.selectByCommentId('')).rejects.toThrowError(ReplyRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })
})
