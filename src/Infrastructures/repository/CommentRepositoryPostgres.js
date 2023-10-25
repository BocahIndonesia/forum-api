const CommentRepositoryInterface = require('../../Domains/comments/CommentRepositoryInterface')
const Comment = require('../../Domains/comments/entities/Comment')
const ArrayItemComment = require('../../Domains/comments/entities/ArrayItemComment')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

module.exports = class CommentRepositoryPostgres extends CommentRepositoryInterface {
  constructor (dependencies) {
    super()

    const { pool, idGenerator } = dependencies

    this._pool = pool
    this._idGenerator = idGenerator
  }

  static ERROR = {
    NOT_FOUND: new NotFoundError('comment yang Anda cari tidak ada'),
    FORBIDDEN_ACCESS: new AuthorizationError('proses gagal karena Anda tidak mempunyai akses ke aksi ini')
  }

  async add (newComment) {
    const id = `comment-${this._idGenerator()}`
    const { content, owner, thread } = newComment
    const comments = await this._pool.query({
      text: 'INSERT INTO "Comment" (id, content, owner, thread) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [id, content, owner, thread]
    })
    const comment = comments.rows[0]

    return new Comment({ ...comment, isDelete: comment.is_delete })
  }

  async softDeleteById (id) {
    await this._pool.query({
      text: 'UPDATE "Comment" SET is_delete = true WHERE id = $1',
      values: [id]
    })
  }

  async verifyExistById (id) {
    const comments = await this._pool.query({
      text: 'SELECT * FROM "Comment" WHERE id = $1',
      values: [id]
    })

    if (!comments.rowCount) throw CommentRepositoryPostgres.ERROR.NOT_FOUND
  }

  async verifyAccess ({ commentId, userId }) {
    const comments = await this._pool.query({
      text: 'SELECT * FROM "Comment" WHERE id = $1 AND owner = $2',
      values: [commentId, userId]
    })

    if (!comments.rowCount) throw CommentRepositoryPostgres.ERROR.FORBIDDEN_ACCESS
  }

  async selectByThreadId (threadId) {
    const comments = await this._pool.query({
      text: `
        SELECT
          C.id AS id,
          C.date AS date,
          C.content AS content,
          C.is_delete AS "isDelete",
          U.username AS username
        FROM "Comment" AS C
        INNER JOIN "User" AS U
        ON U.id = C.owner
        WHERE C.thread = $1
        ORDER BY C.date ASC
      `,
      values: [threadId]
    })

    return comments.rows.map(comment => new ArrayItemComment({ ...comment, replies: [] }))
  }
}
