const { expect, it, before } = exports.lab = require('lab').script();

//9/ You can also test plugins in isolation.
let server = null;
before(done => {
  server = new (require('hapi').Server)();
  server.connection({ port: 3000 })
  server.register([
    require('./index')
  ])
  done()
})

//9/ The same test but using manually configured server.
it('should server products', () => {
  return server.inject({
    method: 'GET',
    url: '/',
  }).then(response => {
    expect(response.result.length).to.equal(3)
    expect(response.headers['content-type']).to.contain('application/json')
  })
})

