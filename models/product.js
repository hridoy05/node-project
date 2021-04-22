const fs = require("fs");
const path = require("path");

const Cart = require('./cart') 

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageurl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageurl;
    this.price = price;
    this.description = description;
  }
  save() {
    getProductsFromFile((products) => {
      console.log("before update",this.id);
      if (this.id) {
        console.log("update",this.id);
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        console.log(existingProductIndex);
        const updateProducts = [...products];
        updateProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        
        fs.writeFile(p, JSON.stringify(products), (err) => {
          
          console.log(err);
        });
      }
    });
  }
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
  static deleteById(id){
    getProductsFromFile((products) => {
      const product = products.find(prod => prod.id=== id)
      const updateProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updateProducts),err => {
        if(!err){
          Cart.deleteProduct(id,product.price)
        }
      })
      
    });

  }
};
