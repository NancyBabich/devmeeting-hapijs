const Boom = require('boom')

const products = require('./products')
const schemas = require('./schemas')

exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: (_request, reply) => {
        reply(products.list)
      },
      response: {
        schema: schemas.products
      }
    }
  })

  server.route({
    method: 'DELETE',
    path: '/{id}',
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
      response: {
        status: {
          204: schemas.any,
          404: schemas.error,
        }
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/',
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
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'api-produts',
    version: '1.0.0'
  }
}
