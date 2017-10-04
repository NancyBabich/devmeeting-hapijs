//13/ Each plugin exports a `register` function.
exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  })

  next()
}

//6/ And some additional metadata.
exports.register.attributes = {
  pkg: {
    name: 'static',
    version: '1.0.0'
  }
}
