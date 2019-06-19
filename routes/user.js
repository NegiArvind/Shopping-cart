var express = require('express');
var router = express.Router();
var csrf=require('csurf')
var passport=require('passport')


var csrfProtection=csrf();
router.use(csrfProtection);


router.get('/profile',isLoggedIn,function(req,res,next){
  res.render('user/profile');
});

router.get("/logout",isLoggedIn,function(req,res,next){
  req.logout(); //logout is a method of passport
  res.redirect('/');
});

//We are using notLoggedIn as middleware. Before going to get first we are checking notLoggedIn middleware.
router.use('/', notLoggedIn, function(req,res,next){
  next();
});

router.get("/signup",function(req,res,next){
  var messages=req.flash('error');
  res.render('user/signup',{csrfToken: req.csrfToken, messages:messages, hasErrors: messages.length>0})
});

router.post("/signup",passport.authenticate('local.signup',{
    //because we have set everything with passport in passport.js script inside config folder
    successRedirect: '/user/profile', // it will redirect user to this url on success
    failureRedirct: '/user/signup', // it will redirect user to this url on success
    failureFlash:true // it will show that message which have set in passport.use method.
}));

router.get("/signin",function(req,res,next){
  var messages=req.flash('error');
  res.render('user/signin',{csrfToken: req.csrfToken, messages:messages, hasErrors: messages.length>0})
});

router.post("/signin",passport.authenticate('local.signin',{
    //because we have set everything with passport in passport.js script inside config folder
    successRedirect: '/', // it will redirect user to this url on success
    failureRedirct: '/user/signin', // it will redirect user to this url on success
    failureFlash:true // it will show that message which have set in passport.use method.
}));


module.exports=router


//This below is our self made middlerware function. before sending it to server first we are checking whether user
//is Authtenticated or not (Authtenticated method is of passport module). if yes then passing to next which is server
//else redirecting to home page.
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

//This below is a middlerware for sign in or sign up. if user is logged in and he wants to go sign in page then
//we won't allow him to go there. We will take him to home page. Same for sign up also.
function notLoggedIn(req,res,next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
