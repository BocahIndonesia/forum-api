const DomainErrorTranslator = require('../DomainErrorTranslator')
const InvariantError = require('../InvariantError')

describe('DomainErrorTranslator', () => {
  it('translates domain error', () => {
    Object.keys(DomainErrorTranslator.maps).forEach(key => {
      expect(DomainErrorTranslator.translate(new Error(key))).toStrictEqual(new InvariantError(DomainErrorTranslator.maps[key]))
    })
  })

  it('It does not translate any error that does not need to be translated', () => {
    // Arrange
    const error = new Error('DOES_NOT_NEED_TO_BE_TRANSLATED')

    // Action
    const translatedError = DomainErrorTranslator.translate(error)

    // Assert
    expect(translatedError).toStrictEqual(error)
  })
})
