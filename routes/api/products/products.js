const products = require('./products.json');

class Products {
  constructor (data = products) {
    this._data = data
  }

  get list () {
    return this._data
  }

  add (product) {
    this._data.push(product)
  }

  remove (id) {
    const len = this._data.length;
    this._data = this._data.filter(p => p.id !== id)
    return this._data.length !== len;
  }
}


module.exports = new Products();
