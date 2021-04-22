const Product = require("../models/product");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const imageurl = req.body.imageurl
  const price = req.body.price
  const description = req.body.description
  const product = new Product(null,title,imageurl,price,description);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  // const editMode = (req.query.edit === undefined || req.query.edit.toLowerCase() === 'true' ? true : false)
  if(!editMode){
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId, product => {
   
    if(!product){
      res.redirect('/')
    }
    res.render("admin/edit-product", {
      pageTitle: "edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
      
    });
  })
};

exports.postEditProduct = (req, res, next)=> {
  const prodId= req.body.productId
  console.log("from admin", prodId);
  const updatedTitle = req.body.title
  const updatedImageUrl = req.body.imageurl
  const updatedPrice = req.body.price
  
  const updatedDesc= req.body.description

  const updateProduct = new Product(prodId, updatedTitle,updatedImageUrl,updatedPrice, updatedDesc)
  updateProduct.save()
  res.redirect('/admin/products')
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.deleteById(prodId)
  res.redirect('/admin/products')
}