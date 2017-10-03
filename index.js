'use strict'

// Import hapi
const Hapi = require('hapi')
const fs = require('fs')

//4/ Configure the server.
const server = new Hapi.Server()
server.connection({
  port: process.env.PORT || 3000
})

//7/ Manually handle requests and serve files in response.
server.route([{
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply(fs.readFileSync('./public/index.html', 'utf8'))
  }
}, {
  method: 'GET',
  path: '/styles.css',
  handler: (request, reply) => {
    reply(fs.readFileSync('./public/styles.css', 'utf8'))
      .header('Content-type', 'text/css')
  }
}, {
  method: 'GET',
  path: '/frontend.js',
  handler: (request, reply) => {
    reply(fs.readFileSync('./public/frontend.js', 'utf8'))
  }
}])

//7/ Start the server
server.start(err => {
  if (err) {
    throw err;
  }

  console.log(`Server running at ${server.info.port}`)
})
