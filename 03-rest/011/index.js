'use strict'

const Hapi = require('hapi')
const products = require('./models/products')

const server = new Hapi.Server()
server.connection({
  port: process.env.PORT || 3000
})

server.register([
  require('inert'),
  require('vision'),
  //2/ add logging with some configuration
  {
    register: require('good'),
    options: {
      //3/ Report host machine ops
      ops: {
        interval: 5000
      },
      //9/ Report logs and responses on the console.
      reporters: {
        consoleReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  }
], err => {
  rethrow(err)

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
