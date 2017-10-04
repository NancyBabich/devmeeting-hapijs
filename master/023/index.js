'use strict'

const Glue = require('glue')
const manifest = require('./manifest.json')
manifest.connections[0].port = process.env.PORT || 3000

const options = {
  relativeTo: __dirname
}
const server = Glue.compose(manifest, options)

if (module.parent) {
  module.exports = server;
} else {
  server
    .then(server => server.start().then(() =>{
      console.log(`Server running at ${server.info.port}`)
    }))
    .catch(err => {
      console.error(err)
      process.exit(-1)
    })
}
