exports.up = pgm => {
  pgm.createTable('Thread', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    body: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"User"(id)',
      referencesConstraintName: 'fk_user',
      onDelete: 'CASCADE'
    },
    date: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = pgm => {
  pgm.dropConstraint('Thread', 'fk_user')
  pgm.dropTable('Thread')
}
