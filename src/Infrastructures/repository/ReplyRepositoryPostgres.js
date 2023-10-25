const ReplyRepositoryInterface = require('../../Domains/replies/ReplyRepositoryInterface')
const Reply = require('../../Domains/replies/entities/Reply')
const ArrayItemReply = require('../../Domains/replies/entities/ArrayItemReply')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

module.exports = class ReplyRepositoryPostgres extends ReplyRepositoryInterface {
  constructor (dependencies) {
    super()

    const { pool, idGenerator } = dependencies

    this._pool = pool
    this._idGenerator = idGenerator
  }

  static ERROR = {
    NOT_FOUND: new NotFoundError('reply yang Anda cari tidak ada'),
    FORBIDDEN_ACCESS: new AuthorizationError('proses gagal karena Anda tidak mempunyai akses ke aksi ini')
  }

  async add (newReply) {
    const id = `reply-${this._idGenerator()}`
    const { content, owner, comment } = newReply
    const replies = await this._pool.query({
      text: 'INSERT INTO "Reply" (id, content, owner, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [id, content, owner, comment]
    })
    const reply = replies.rows[0]

    return new Reply({ ...reply, isDelete: reply.is_delete })
  }

  async softDeleteById (id) {
    await this._pool.query({
      text: 'UPDATE "Reply" SET is_delete = true WHERE id = $1',
      values: [id]
    })
  }

  async verifyExistById (id) {
    const replies = await this._pool.query({
      text: 'SELECT * FROM "Reply" WHERE id = $1',
      values: [id]
    })

    if (!replies.rowCount) throw ReplyRepositoryPostgres.ERROR.NOT_FOUND
  }

  async verifyAccess ({ replyId, userId }) {
    const replies = await this._pool.query({
      text: 'SELECT * FROM "Reply" WHERE id = $1 AND owner = $2',
      values: [replyId, userId]
    })

    if (!replies.rowCount) throw ReplyRepositoryPostgres.ERROR.FORBIDDEN_ACCESS
  }

  async selectByCommentId (commentId) {
    const replies = await this._pool.query({
      text: `
        SELECT
          R.id AS id,
          R.content AS content,
          R.date AS date,
          R.is_delete AS "isDelete",
          U.username AS username
        FROM "Reply" AS R
        INNER JOIN "User" AS U
        ON U.id = R.owner
        WHERE R.comment = $1
        ORDER BY R.date ASC
      `,
      values: [commentId]
    })

    return replies.rows.map(reply => new ArrayItemReply(reply))
  }
}
