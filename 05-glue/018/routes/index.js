const products = require('./api/products/products')

exports.register = (server, options, next) => {
  server.views({
    engines: {
      'html': {
        module: require('handlebars')
      }
    },
    path: 'templates'
  })

  server.route({
    method: 'GET',
    path: '/',
    handler (_request, reply) {
      reply.view('index', {
        products: JSON.stringify(products.list)
      })
    }
  })

  next()
}

exports.register.attributes = {
  pkg: {
    name: 'index',
    version: '1.0.0'
  }
}
