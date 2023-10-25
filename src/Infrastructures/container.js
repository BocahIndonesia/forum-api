/* istanbul ignore file */
require('dotenv').config()
const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const pool = require('./database/postgres/pool')
const jwt = require('@hapi/jwt')

// create container
const container = createContainer()

// service
const PasswordHashInterface = require('../Applications/security/PasswordHashInterface')
const BcryptPasswordHash = require('../Infrastructures/security/BcryptPasswordHash')
const TokenManagerInterface = require('../Applications/security/TokenManagerInterface')
const JwtManager = require('../Infrastructures/security/JwtManager')

container.register([
  {
    key: PasswordHashInterface.name,
    Class: BcryptPasswordHash,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'bcrypt',
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: TokenManagerInterface.name,
    Class: JwtManager,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'jwt',
          concrete: jwt.token
        },
        {
          name: 'accessTokenKey',
          concrete: process.env.ACCESS_TOKEN_KEY
        },
        {
          name: 'refreshTokenKey',
          concrete: process.env.REFRESH_TOKEN_KEY
        },
        {
          name: 'accessTokenAge',
          concrete: +process.env.ACCCESS_TOKEN_AGE ?? 3000
        }
      ]
    }
  }
])

// repository
const UserRepositoryInterface = require('../Domains/users/UserRepositoryInterface')
const UserRepositoryPostgres = require('../Infrastructures/repository/UserRepositoryPostgres')
const TokenRepositoryInterface = require('../Domains/authentications/TokenRepositoryInterface')
const TokenRepositoryPostgres = require('../Infrastructures/repository/TokenRepositoryPostgres')
const ThreadRepositoryInterface = require('../Domains/threads/ThreadRepositoryInterface')
const ThreadRepositoryPostgres = require('../Infrastructures/repository/ThreadRepositoryPostgres')
const CommentRepositoryInterface = require('../Domains/comments/CommentRepositoryInterface')
const CommentRepositoryPostgres = require('../Infrastructures/repository/CommentRepositoryPostgres')
const ReplyRepositoryInterface = require('../Domains/replies/ReplyRepositoryInterface')
const ReplyRepositoryPostgres = require('../Infrastructures/repository/ReplyRepositoryPostgres')

container.register([
  {
    key: UserRepositoryInterface.name,
    Class: UserRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'pool',
          concrete: pool
        },
        {
          name: 'idGenerator',
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: TokenRepositoryInterface.name,
    Class: TokenRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'pool',
          concrete: pool
        }
      ]
    }
  },
  {
    key: ThreadRepositoryInterface.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'pool',
          concrete: pool
        },
        {
          name: 'idGenerator',
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: CommentRepositoryInterface.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'pool',
          concrete: pool
        },
        {
          name: 'idGenerator',
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: ReplyRepositoryInterface.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'pool',
          concrete: pool
        },
        {
          name: 'idGenerator',
          concrete: nanoid
        }
      ]
    }
  }
])

// use case
const UserUseCase = require('../Applications/use_cases/UserUseCase')
const AuthenticationUseCase = require('../Applications/use_cases/AuthenticationUseCase')
const ThreadUseCase = require('../Applications/use_cases/ThreadUseCase')
const CommentUseCase = require('../Applications/use_cases/CommentUseCase')
const ReplyUseCase = require('../Applications/use_cases/ReplyUseCase')

container.register([
  {
    key: UserUseCase.name,
    Class: UserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepositoryInterface.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHashInterface.name
        }
      ]
    }
  },
  {
    key: AuthenticationUseCase.name,
    Class: AuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepositoryInterface.name
        },
        {
          name: 'tokenRepository',
          internal: TokenRepositoryInterface.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHashInterface.name
        },
        {
          name: 'tokenManager',
          internal: TokenManagerInterface.name
        }
      ]
    }
  },
  {
    key: ThreadUseCase.name,
    Class: ThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepositoryInterface.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepositoryInterface.name
        },
        {
          name: 'replyRepository',
          internal: ReplyRepositoryInterface.name
        },
        {
          name: 'tokenManager',
          internal: TokenManagerInterface.name
        }
      ]
    }
  },
  {
    key: CommentUseCase.name,
    Class: CommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepositoryInterface.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepositoryInterface.name
        },
        {
          name: 'tokenManager',
          internal: TokenManagerInterface.name
        }
      ]
    }
  },
  {
    key: ReplyUseCase.name,
    Class: ReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'replyRepository',
          internal: ReplyRepositoryInterface.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepositoryInterface.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepositoryInterface.name
        },
        {
          name: 'tokenManager',
          internal: TokenManagerInterface.name
        }
      ]
    }
  }
])

module.exports = container
