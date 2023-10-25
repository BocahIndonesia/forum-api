const pool = require('../../database/postgres/pool')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const User = require('../../../Domains/users/entities/User')
const UserRegistration = require('../../../Domains/users/entities/UserRegistration')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')

describe('UserRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserTableHelper.clear()
  })

  // Arrange
  function stubIdGenerator () {
    return '123'
  }
  const expectedId = `user-${stubIdGenerator()}`
  const userRepository = new UserRepositoryPostgres({ pool, idGenerator: stubIdGenerator })

  describe('register', () => {
    // Arrange
    const userRegistration = new UserRegistration({
      fullname: 'user test',
      username: 'user123',
      password: 'hash(supersecret)'
    })

    it('It persists user data in the database', async () => {
      // Action
      await userRepository.register(userRegistration)

      // Assert
      const users = await UserTableHelper.selectById(expectedId)
      expect(users).not.toBe(undefined)
    })

    it('It returns User object', async () => {
      // Action
      const user = await userRepository.register(userRegistration)

      // Assert
      expect(user).toStrictEqual(new User({
        id: expectedId,
        fullname: userRegistration.fullname,
        username: userRegistration.username,
        password: userRegistration.password
      }))

      // Clean-up
      await UserTableHelper.clear()
    })
  })

  describe('verifyUsernameAvailibility', () => {
    it('It throws an InvariantError if username is already taken', async () => {
      // Arrange
      const username = 'existeduser'

      await UserTableHelper.insert({ username })

      // Action & Assert
      await expect(userRepository.verifyUsernameAvailibility(username)).rejects.toThrowError(InvariantError)
    })

    it('It does not throw InvariantError if username has not been taken yet', async () => {
      // Arrange
      const username = 'newusername'

      // Action & Assert
      await expect(userRepository.verifyUsernameAvailibility(username)).resolves.not.toThrowError(InvariantError)
    })
  })
})
