const ThreadRepositoryInterface = require('../../Domains/threads/ThreadRepositoryInterface')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

module.exports = class ThreadRepositoryPostgres extends ThreadRepositoryInterface {
  constructor (dependencies) {
    super()

    const { pool, idGenerator } = dependencies

    this._pool = pool
    this._idGenerator = idGenerator
  }

  static ERROR = {
    THREAD_NOT_FOUND: new NotFoundError('thread tidak ditemukan')
  }

  async add (newThread) {
    const id = `thread-${this._idGenerator()}`
    const { title, body, owner } = newThread
    const threads = await this._pool.query({
      text: 'INSERT INTO "Thread" (id, title, body, owner) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [id, title, body, owner]
    })

    return threads.rows[0]
  }

  async verifyExistById (id) {
    const threads = await this._pool.query({
      text: 'SELECT * FROM "Thread" WHERE id = $1',
      values: [id]
    })

    if (!threads.rowCount) throw ThreadRepositoryPostgres.ERROR.THREAD_NOT_FOUND
  }

  async getDetailedById (id) {
    const threads = await this._pool.query({
      text: `
        SELECT 
          T.id AS id,
          T.title AS title,
          T.body AS body,
          T.date AS date,
          U.username AS username
        FROM "Thread" AS T
        INNER JOIN "User" AS U
        ON U.id = T.owner
        WHERE T.id = $1
      `,
      values: [id]
    })

    if (!threads.rowCount) throw ThreadRepositoryPostgres.ERROR.THREAD_NOT_FOUND

    return threads.rows[0]
  }
}
