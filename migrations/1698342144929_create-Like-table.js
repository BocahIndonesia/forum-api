exports.up = pgm => {
  pgm.createTable('Like', {
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
    }
  })
}

exports.down = pgm => {
  pgm.dropConstraint('Like', 'fk_user')
  pgm.dropConstraint('Like', 'fk_comment')
  pgm.dropTable('Like')
}
