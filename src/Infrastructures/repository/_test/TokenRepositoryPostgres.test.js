const pool = require('../../database/postgres/pool')
const TokenTableHelper = require('../../../../tests/TokenTableHelper')
const RefreshToken = require('../../../Domains/authentications/entities/RefreshToken')
const TokenRepositoryPostgres = require('../TokenRepositoryPostgres')

describe('TokenRepositoryPostgres', () => {
  // Arrange
  const tokenRepository = new TokenRepositoryPostgres({ pool })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await TokenTableHelper.clear()
  })

  describe('add', () => {
    // Arrange
    const expectedToken = new RefreshToken({
      token: 'refresh-token'
    })

    it('It persists token in the database', async () => {
      // Action
      const token = await tokenRepository.add(expectedToken.token)

      // Assert
      const result = await TokenTableHelper.selectByToken(token.token)
      expect(result).not.toBe(undefined)
    })

    it('It returns RefreshToken object', async () => {
      // Action
      const token = await tokenRepository.add(expectedToken.token)

      // Assert
      expect(token).toBeInstanceOf(RefreshToken)
      expect(token).toStrictEqual(expectedToken)
    })
  })

  describe('delete', () => {
    it('token gets removed successfully', async () => {
      // Arrange
      const refreshToken = 'refresh-token'
      await TokenTableHelper.insert(refreshToken)

      // Action
      await tokenRepository.delete(refreshToken)

      // Assert
      const result = await TokenTableHelper.selectByToken(refreshToken)
      expect(result).toBe(undefined)
    })
  })

  describe('verifyExistByToken', () => {
    it('It throws an InvariantError if the token does not exist in the database', async () => {
      // Action & Assert
      await expect(tokenRepository.verifyExistByToken('doesnotexist')).rejects.toThrowError(TokenRepositoryPostgres.ERROR.TOKEN_NOT_FOUND)
    })

    it('It does not throw an InvariantError if the token does not exist in the database', async () => {
      // Arrange
      const refreshToken = 'refresh-token'

      await TokenTableHelper.insert(refreshToken)

      // Action & Assert
      await expect(tokenRepository.verifyExistByToken(refreshToken)).resolves.not.toThrowError(TokenRepositoryPostgres.ERROR.TOKEN_NOT_FOUND)
    })
  })
})
