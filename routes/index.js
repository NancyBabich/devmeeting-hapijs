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
    config: {
      handler (_request, reply) {
        reply.view('index', {
          products: JSON.stringify(products.list)
        })
      },
      //3/ You can also add tags, descriptions and notes to the routes.
      tags: ['html'],
      description: 'Render index page.',
      notes: 'It is not an API!'
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
