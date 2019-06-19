var express = require('express');
var router = express.Router();
var Cart=require('../models/cart');

var Product=require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {

  successMsg=req.flash("success")[0]; //this success message we will get from card successful checkout

  //find method return all the Product object from database
  Product.find(function(err,docs){
    var productChunks=[];
    var chunkSize=3;
    for(var i=0;i<docs.length;i+=chunkSize){
      productChunks.push(docs.slice(i,i+chunkSize)); //pusing an array into productChunks array.
    }
    res.render('shop/index', { title: 'Shopping cart', products: productChunks, successMsg:successMsg,noMessage:!successMsg });
  });
});

//id will be dynamic
router.get('/add-to-cart/:id',function(req,res,next){
  var productId=req.params.id;
  var cart=new Cart(req.session.cart ? req.session.cart:{});
  Product.findById(productId,function(err,product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product,productId);
    req.session.cart=cart;
    console.log(cart);
    res.redirect('/');
  });
});


//Shopping cart
router.get('/shopping-cart',function(req,res,next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products:null});
  }
  var cart=new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products:cart.generateArray(), totalPrice: cart.totalPrice});
});


//Checkout
router.get("/checkout",function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart=new Cart(req.session.cart);
  var errMsg=req.flash('error')[0] //This is the error which we will get after submitting card detail.
  res.render('shop/checkout',{total: cart.totalPrice,errMsg:errMsg,noErrors: !errMsg});
});


//post request of Checkout
router.post("/checkout",function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart=new Cart(req.session.cart);

  var stripe=require("stripe")(
    "sk_test_TAPIcke4RkzrYurjUiDE654g00nn3ReDCK"
  );

  stripe.charges.create({
    amount: cart.totalPrice*100,
    currency: 'usd',
    description: 'Charge for test@example.com',
    source: req.body.stripeToken,
  },function(err,charge){
    if(err){
      req.flash('error',err.message);
      return res.redirect("/checkout");
    }
    req.flash("success","Successfully bought product");
    req.cart=null;
    res.redirect('/');
  });
})

module.exports = router;
