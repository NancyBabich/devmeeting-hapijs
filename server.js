'use strict'

const Hapi = require('hapi')
const Boom = require('boom')

const products = require('./models/products')
const schemas = require('./schemas')

const server = new Hapi.Server()
server.connection({
  port: process.env.PORT || 3000
})

server.register([
  require('inert'),
  require('vision'),
  {
    register: require('good'),
    options: {
      ops: {
        interval: 5000
      },
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
  if (err) {
    throw err;
  }

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
    config: {
      handler: (_request, reply) => reply(products.list),
      //4/ Validating response is really easy.
      // By default hapi will return 500 if schema doesn't match.
      response: {
        schema: schemas.products
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/products/{id}',
    config: {
      validate: {
        params: {
          id: schemas.id
        }
      }
    },
    config: {
      handler (request, reply) {
        const { id } = request.params;
        if (products.remove(parseInt(id))) {
          reply().code(204)
        } else {
          reply(Boom.notFound('Cannot find product'))
        }
      },
      //6/ Validating response depending on the status code.
      response: {
        status: {
          204: schemas.any,
          404: schemas.error,
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/products',
    config: {
      validate: {
        payload: schemas.product
      }
    },
    handler (request, reply) {
      const product = request.payload
      products.add(product)
      reply(product).code(201)
    }
  },
  {
    method: 'GET',
    path: '/',
    handler (_request, reply) {
      reply.view('index', {
        products: JSON.stringify(products.list)
      })
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

module.exports = server;
