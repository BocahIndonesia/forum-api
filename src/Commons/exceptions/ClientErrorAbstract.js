module.exports = class ClientErrorAbstract extends Error {
  static ERROR = {
    ABSTRACT_INSTATIATION: new Error('Abstract class cannot be instantiated')
  }

  constructor (message, code) {
    super(message)

    if (this.constructor.name === ClientErrorAbstract.name) {
      throw ClientErrorAbstract.ERROR.ABSTRACT_INSTATIATION
    }

    this.name = this.constructor.name
    this.code = code
  }
}
