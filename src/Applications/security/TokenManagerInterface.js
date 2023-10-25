module.exports = class TokenManagerInterface {
  constructor () {
    if (this.constructor.name === TokenManagerInterface.name) {
      throw TokenManagerInterface.ERROR.ABSTRACT_INSTANTIATION
    }
  }

  static ERROR = {
    ABSTRACT_INSTANTIATION: new Error('Abstract class cannot be instantiated'),
    UNIMPLEMENTED_METHOD: new Error('TOKEN_MANAGER.UNIMPLEMENTED_METHOD')
  }

  generateAccessToken ({ id }) {
    throw TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  generateRefreshToken ({ id }) {
    throw TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  verifyRefreshToken (token) {
    throw TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  verifyAccessToken (token) {
    throw TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  decodeToken (token) {
    throw TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD
  }

  extractAccessTokenFromBearer (bearer) {
    throw TokenManagerInterface.ERROR.UNIMPLEMENTED_METHOD
  }
}
