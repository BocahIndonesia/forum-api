const LikeRepositoryInterface = require('../../Domains/likes/LikeRepositoryInterface')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

module.exports = class ReplyRepositoryPostgres extends LikeRepositoryInterface {
  constructor (dependencies) {
    super()

    const { pool } = dependencies

    this._pool = pool
  }

  static ERROR = {
    NOT_FOUND: new NotFoundError('like yang Anda cari tidak ada')
  }

  async add (like) {
    const { comment, owner } = like

    const likes = await this._pool.query({
      text: 'INSERT INTO "Like" (comment, owner) VALUES ($1, $2) RETURNING *',
      values: [comment, owner]
    })

    return likes.rows[0]
  }

  async delete (like) {
    const { comment, owner } = like

    await this._pool.query({
      text: 'DELETE FROM "Like" WHERE comment = $1 AND owner = $2',
      values: [comment, owner]
    })
  }

  async verifyExist (like) {
    const { comment, owner } = like

    const likes = await this._pool.query({
      text: 'SELECT * FROM "Like" WHERE comment = $1 AND owner = $2',
      values: [comment, owner]
    })

    if (!likes.rowCount) throw ReplyRepositoryPostgres.ERROR.NOT_FOUND
  }

  async selectByCommentId (commentId) {
    const likes = await this._pool.query({
      text: `
        SELECT
          *
        FROM "Like"
        WHERE "Like".comment = $1
      `,
      values: [commentId]
    })

    return likes.rows
  }
}
