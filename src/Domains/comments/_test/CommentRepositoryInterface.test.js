const CommentRepositoryInterface = require('../CommentRepositoryInterface')

describe('CommentRepositoryInterface', () => {
  it('Instantiation throws an error on direct instantiation', () => {
    expect(() => new CommentRepositoryInterface()).toThrowError(CommentRepositoryInterface.ERROR.ABSTRACT_INSTATIATION)
  })

  // Arrange
  class StubCommentRepository extends CommentRepositoryInterface {}
  const stubCommentRepository = new StubCommentRepository()

  describe('add', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubCommentRepository.add({})).rejects.toThrowError(CommentRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('softDeleteById', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubCommentRepository.softDeleteById('')).rejects.toThrowError(CommentRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyExistById', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubCommentRepository.verifyExistById('')).rejects.toThrowError(CommentRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyAccess', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubCommentRepository.verifyAccess({})).rejects.toThrowError(CommentRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('selectByThreadId', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubCommentRepository.selectByThreadId('')).rejects.toThrowError(CommentRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })
})
