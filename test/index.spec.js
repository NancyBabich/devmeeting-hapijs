const { expect, it } = exports.lab = require('lab').script();
const server = require('../server');

it('should serve index.html', () => {
  return server.inject({
    method: 'GET',
    url: '/',
  }).then(response => {
    expect(response.result).to.contain('html')
    expect(response.headers['content-type']).to.contain('text/html')
  })
})

it('should server products', () => {
  return server.inject({
    method: 'GET',
    url: '/api/products',
  }).then(response => {
    expect(response.result.length).to.equal(3)
    expect(response.headers['content-type']).to.contain('application/json')
  })
})

it('should add new product', () => {
  return server.inject({
    method: 'POST',
    url: '/api/products',
    payload: {
      id: 5,
      name: 'Test',
      description: 'abcd',
      price: 200
    }
  }).then(response => {
    expect(response.statusCode).to.equal(201)
    expect(response.headers['content-type']).to.contain('application/json')
    return server.inject({
      method: 'GET',
      url: '/api/products'
    })
  }).then(response => {
    expect(response.result.length).to.equal(4)
  })
})

it('should remove product', () => {
  return server.inject({
    method: 'DELETE',
    url: '/api/products/1'
  }).then(response => {
    expect(response.statusCode).to.equal(204)
    return server.inject({
      method: 'GET',
      url: '/api/products'
    })
  }).then(response => {
    expect(response.result.length).to.equal(3)
  })
})
