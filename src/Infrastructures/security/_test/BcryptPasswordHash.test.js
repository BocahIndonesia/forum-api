const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError')
const BcryptPasswordHash = require('../BcryptPasswordHash')

describe('BcryptPasswordHash', () => {
  // Arrange
  const bcrypt = require('bcrypt')
  const password = 'supersecret'
  const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt })

  describe('hash', () => {
    it('It encrypts password correctly', async () => {
      // Arrange
      const spyBcryptHash = jest.spyOn(bcrypt, 'hash')

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash(password)

      // Assert
      expect(typeof encryptedPassword).toBe('string')
      expect(encryptedPassword).not.toBe(password)
      expect(spyBcryptHash).toBeCalledWith(password, +process.env.SALT_HASH)
    })
  })

  describe('compare', () => {
    it('It throws an AuthenticationError if the password does not match', async () => {
      // Action & Assert
      await expect(bcryptPasswordHash.compare('lol', 'encrypted')).rejects.toThrowError(AuthenticationError)
    })

    it('It does not throw an AuthenticationError if the password match', async () => {
      // Arrange
      const password = 'supersecret'
      const encryptedPassword = await bcryptPasswordHash.hash(password)

      // Action & Assert
      await expect(bcryptPasswordHash.compare(password, encryptedPassword)).resolves.not.toThrowError(AuthenticationError)
    })
  })
})
