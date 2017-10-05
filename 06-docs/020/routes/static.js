exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/{param*}',
    config: {
      handler: {
        directory: {
          path: 'public'
        }
      },
      //3/ We can ignore a route from documentation.
      plugins: {
        lout: false
      }
    }
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'static',
    version: '1.0.0'
  }
}
