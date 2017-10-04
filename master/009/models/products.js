// Initial list of products is loaded from JSON.
const products = require('./products.json');

//4/ Create a class to manage products.
class Products {
  constructor (data = products) {
    this._data = data
  }

  //3/ Returns a list of products.
  get list () {
    return this._data
  }

  //3/ Adds new product.
  add (product) {
    this._data.push(product)
  }

  //3/ Removes a product by id.
  remove (id) {
    this._data = this._data.filter(p => p.id !== id)
  }
}


module.exports = new Products();
