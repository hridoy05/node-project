const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updateProduct;
      //add new product/ increase quantity
      if (existingProduct) {
        updateProduct = { ...existingProduct };
        console.log(updateProduct);
        updateProduct.qty = updateProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updateProduct;
        console.log(cart);
      } else {
        updateProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updateProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
    //analyze the cart => find existing product
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent)=>{
      if(err){
        return;
      }
      const updatedCart = {...JSON.parse(fileContent)}
      const product = updatedCart.products.find(prod => prod.id === id)
      if (!product) {
        return;
      }
      const productQty = product.qty
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id )
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice*productQty
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    })
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent)
      if (err) {
        cb(err)
      }
      else{
        cb(cart)
      }
    })
  }
};
