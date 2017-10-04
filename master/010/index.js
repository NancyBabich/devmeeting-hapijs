'use strict'

const Hapi = require('hapi')
const products = require('./models/products')

const server = new Hapi.Server()
server.connection({
  port: process.env.PORT || 3000
})

server.register([
  require('inert'),
  // Add template support
  require('vision')
], err => {
  rethrow(err)

  //8/ Template configuration.
  server.views({
    engines: {
      'html': {
        module: require('handlebars')
      }
    },
    path: 'templates'
  })

  server.route([
  {
    method: 'GET',
    path: '/api/products',
    handler: (_request, reply) => reply(products.list),
  },
  //12/ Index file is now rendered from a template.
  {
    method: 'GET',
    path: '/',
    handler: {
      view: {
        template: 'index',
        context: {
          products: JSON.stringify(products.list)
        }
      }
    }
  },
  {
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
