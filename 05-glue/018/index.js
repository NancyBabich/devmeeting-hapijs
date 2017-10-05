'use strict'

const Glue = require('glue')
// Our entire server definition becomes just a JSON file.
const manifest = require('./manifest.json')
manifest.connections[0].port = process.env.PORT || 3000

// Tell glue how to resolve relative paths
const options = {
  relativeTo: __dirname
}
// Our server is now configured asynchronously and returns a promise.
const server = Glue.compose(manifest, options)

//2/ Detect if we are in test environment
if (module.parent) {
  module.exports = server;
} else {
  //8/ or start the server otherwise
  server
    .then(server => server.start().then(() =>{
      console.log(`Server running at ${server.info.port}`)
    }))
    .catch(err => {
      console.error(err)
      process.exit(-1)
    })
}
