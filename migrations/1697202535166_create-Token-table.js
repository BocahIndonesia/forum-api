exports.up = pgm => {
  pgm.createTable('Token', {
    token: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('Token')
}
