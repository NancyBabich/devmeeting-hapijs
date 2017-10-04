exports.register = (server, options, next) => {
  // We are configuring jwt authentication strategy.
  server.auth.strategy('jwt', 'jwt', false, {
    // A secret key
    key: process.env.JWT_SECRET_KEY || 'secret',
    //3/ Additional validation function
    validateFunc(decoded, request, callback) {
      callback(null, true)
    },
    //3/ Allowed algorithms
    verifyOptions: {
      algorithms: ['HS256']
    }
  })

  // Uncomment to require authentication everywhere
  // server.auth.default('jwt')

  server.route({
    method: 'GET',
    path: '/protected',
    config: {
      //5/ This route requires authentication
      auth: 'jwt',
      handler(request, reply) {
        reply(`Hello protected: ${JSON.stringify(request.auth.credentials, null, 2)}`)
      },
    }
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'auth',
    version: '1.0.0'
  }
}
