const UserRepositoryInterface = require('../UserRepositoryInterface')

describe('UserRepositoryInterface', () => {
  it('Instantiation throws an error on direct instantiation', () => {
    expect(() => new UserRepositoryInterface()).toThrowError(UserRepositoryInterface.ERROR.ABSTRACT_INSTATIATION)
  })

  // Arrange
  class StubUserRepository extends UserRepositoryInterface {}
  const stubUserRepository = new StubUserRepository()

  describe('register', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubUserRepository.register({})).rejects.toThrowError(UserRepositoryInterface.UNIMPLEMENTED_METHOD)
    })
  })

  describe('verifyUsernameAvailability', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubUserRepository.verifyUsernameAvailibility('')).rejects.toThrowError(UserRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })

  describe('getByUsername', () => {
    it('It throws an error when the method has not been implemented inside the child class', async () => {
      // Action & Assert
      await expect(stubUserRepository.getByUsername('')).rejects.toThrowError(UserRepositoryInterface.ERROR.UNIMPLEMENTED_METHOD)
    })
  })
})
