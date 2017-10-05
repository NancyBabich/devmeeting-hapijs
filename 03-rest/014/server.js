'use strict'

const Hapi = require('hapi')
const boom = require('boom')
const products = require('./models/products')

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
    handler: (_request, reply) => reply(products.list),
  },
  {
    method: 'DELETE',
    path: '/api/products/{id}',
    handler (request, reply) {
      const { id } = request.params;
      if (products.remove(parseInt(id, 10))) {
        reply().code(204)
      } else {
        reply(boom.notFound('Cannot find product'))
      }
    }
  },
  {
    method: 'POST',
    path: '/api/products',
    handler (request, reply) {
      const {id, name, description, price } = request.payload;
      const priceV = parseInt(price, 10)
      if (!id) {
        reply(boom.badRequest('missing id'))
        return
      }
      if (!name) {
        reply(boom.badRequest('missing name'))
        return
      }
      if (!description) {
        reply(boom.badRequest('missing description'))
        return
      }
      if (isNaN(priceV)) {
        reply(boom.badRequest('invalid price'))
        return
      }

      const product = { id, name, description, price: priceV }
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

// Server is now exposed in this module.
module.exports = server;
