const pool = require('../../database/postgres/pool')
const ThreadTableHelper = require('../../../../tests/ThreadTableHelper')
const UserTableHelper = require('../../../../tests/UserTableHelper')
const Thread = require('../../../Domains/threads/entities/Thread')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const DetailedThread = require('../../../Domains/threads/entities/DetailedThread')

describe('ThreadRepositoryPostgres', () => {
  // Arrange
  function stubIdGenerator () {
    return '123'
  }
  const expectedId = `thread-${stubIdGenerator()}`
  const threadRepository = new ThreadRepositoryPostgres({ pool, idGenerator: stubIdGenerator })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ThreadTableHelper.clear()
    await UserTableHelper.clear()
  })

  describe('add', () => {
    // Arrange
    let newThread

    beforeEach(async () => {
      const uploaderUser = await UserTableHelper.insert({ id: 'user-1', username: 'uploader' })
      newThread = new NewThread({
        title: 'title example',
        body: 'body example',
        owner: uploaderUser.id
      })
    })

    afterEach(async () => {
      await ThreadTableHelper.clear()
    })

    it('It persists thread in the database', async () => {
      // Action
      const thread = await threadRepository.add(newThread)

      // Assert
      const result = await ThreadTableHelper.selectById(thread.id)
      expect(result).not.toBe(undefined)
    })

    it('It returns Thread object', async () => {
      // Action
      const thread = await threadRepository.add(newThread)

      // Assert
      expect(thread).toBeInstanceOf(Thread)
      expect(thread).toStrictEqual(new Thread({
        id: expectedId,
        title: newThread.title,
        body: newThread.body,
        date: thread.date,
        owner: newThread.owner
      }))
    })
  })

  describe('verifyExistById', () => {
    it('It throws a NotFoundError if the thread does not exist in database', async () => {
      // Action & Assert
      await expect(threadRepository.verifyExistById('doesnotexist')).rejects.toThrowError(NotFoundError)
    })

    it('It does not throw an Error if the thread exists in the database', async () => {
      // Arrange
      const threadId = 'thread-123'
      const uploaderUser = await UserTableHelper.insert({ username: 'uploader' })
      await ThreadTableHelper.insert({ id: threadId, owner: uploaderUser.id })

      // Action & Assert
      await expect(threadRepository.verifyExistById(threadId)).resolves.toBe()
    })
  })

  describe('getDetailedById', () => {
    it('It throws a NotFoundError if the thread does not exist in database', async () => {
      // Action & Assert
      await expect(threadRepository.getDetailedById('doesnotexist')).rejects.toThrowError(NotFoundError)
    })

    it('It returns DetailedThread object', async () => {
      // Arrange
      const uploaderUser = await UserTableHelper.insert({ username: 'uploader' })
      const { id: threadId, title, body, date } = await ThreadTableHelper.insert({ owenr: uploaderUser.id })

      // Action
      const detailedThread = await threadRepository.getDetailedById(threadId)

      // Assert
      expect(detailedThread).toBeInstanceOf(DetailedThread)
      expect(detailedThread).toStrictEqual(new DetailedThread({
        id: threadId,
        title,
        body,
        date,
        username: uploaderUser.username
      }))
    })
  })
})
