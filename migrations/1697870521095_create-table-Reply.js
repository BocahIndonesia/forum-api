exports.up = pgm => {
  pgm.createTable('Reply', {
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
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"Comment"(id)',
      referencesConstraintName: 'fk_comment',
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
  pgm.dropConstraint('Reply', 'fk_user')
  pgm.dropConstraint('Reply', 'fk_comment')
  pgm.dropTable('Reply')
}
