exports.up = pgm => {
  pgm.createTable('User', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    fullname: {
      type: 'TEXT',
      notNull: true
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true
    },
    password: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('User')
}
