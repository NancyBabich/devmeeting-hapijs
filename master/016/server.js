'use strict'

const Hapi = require('hapi')
const Boom = require('boom')
const Joi = require('joi')
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
    //7/ Validating params is also super easy.
    config: {
      validate: {
        params: {
          id: Joi.number().integer().min(0).required()
        }
      }
    },
    handler (request, reply) {
      const { id } = request.params;
      if (products.remove(id)) {
        reply().code(204)
      } else {
        reply(Boom.notFound('Cannot find product'))
      }
    }
  },
  //13/ Thanks to validation we can get rid of tedious manual checks.
  {
    method: 'POST',
    path: '/api/products',
    config: {
      validate: {
        payload: {
          id: Joi.number().integer().min(0).required(),
          name: Joi.string().alphanum().trim().min(3).required(),
          description: Joi.string().alphanum().trim().min(3).required(),
          price: Joi.number().integer().min(0).required()
        }
      }
    },
    //5/ Handler is now really nice and simple.
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
