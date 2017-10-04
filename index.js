'use strict'

// Just load the server and run it.
const server = require('./server')
server.start(err => {
  if (err) {
    throw err
  }

  console.log(`Server running at ${server.info.port}`)
})
