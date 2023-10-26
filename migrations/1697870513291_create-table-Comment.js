exports.up = pgm => {
  pgm.createTable('Comment', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"User"(id)',
      referencesConstraintName: 'fk_user',
      onDelete: 'CASCADE'
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"Thread"(id)',
      referencesConstraintName: 'fk_thread',
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
  pgm.dropConstraint('Comment', 'fk_user')
  pgm.dropConstraint('Comment', 'fk_thread')
  pgm.dropTable('Comment')
}
