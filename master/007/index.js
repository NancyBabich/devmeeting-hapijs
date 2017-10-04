'use strict'

const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({
  port: process.env.PORT || 3000
})

// Instead of manualy handling static files, we will register `inert` plugin.
server.register(require('inert'), err => {
  rethrow(err)

  //8/ And just create a single route resolving files from `public` directory.
  server.route([{
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  }])
})

server.start(err => {
  rethrow(err)

  console.log(`Server running at ${server.info.port}`)
})

function rethrow (err) {
  if (err) {
    console.error(err)
    throw err
  }
}
