'use strict'

const Hapi = require('hapi')
const products = require('./products.json')

const server = new Hapi.Server()
server.connection({
  port: process.env.PORT || 3000
})

server.register(require('inert'), err => {
  rethrow(err)

  server.route([{
    method: 'GET',
    path: '/api/products',
    handler: (_request, reply) => reply(products),
  }, {
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
