var passport=require('passport');
var User=require('../models/user');
var LocalStrategy=require('passport-local').Strategy;


//Serializing user by user id
passport.serializeUser(function(user,done){
  done(null,user.id); //Serializing user with its id. done is a variable which tell us whether user is serialized or not.
});


passport.deserializeUser(function(id,done){
  //Below method we are finding user by its id and then returning user after deserialize.
  User.findById(id,function(err,user){
    done(err,user);
  });
});

//Sign up the user using passport local
passport.use('local.signup',new LocalStrategy({
    usernameField: "email", //Giving email as userNameField
    passwordField: "password", //Giving password as passwordField
    passReqToCallback: true //making callBack which is passed in below anonymous function as req
  }, function(req,email,password,done){

    req.checkBody('email', "Invalid email").notEmpty().isEmail(); //Checking entered email is in email format
    req.checkBody('password','Invalid password' ).notEmpty().isLength({min:4});//Checking entered password has min 4 length
    var errors=req.validationErrors();
    if(errors){
      var messages=[]
      errors.forEach(function(error){
        messages.push(error);
      });
      return done(null,false,req.flash('error',messages)); //setting error in req flash.
    }
    //Finding user with email in database
    User.findOne({'email':email}, function(err,user){
      if(err){
        return done(err);
      }
      //if user is there means this email has already been used.
      if(user){
        return done(null,false,{message: "Email is already in use"}); //false is telling passport that signup is not successful
      }
      var newUser=new User();
      newUser.email=email;
      newUser.password=newUser.encryptPassword(password);
      newUser.save(function(err,result){
        if(err){
          return done(err);
        }
        return done(null,newUser);
      });
    });
}));

//Signing the user using passport local
passport.use('local.signin',new LocalStrategy({
    usernameField: "email", //Giving email as userNameField
    passwordField: "password", //Giving password as passwordField
    passReqToCallback: true //making callBack which is passed in below anonymous function as req
  }, function(req,email,password,done){
    req.checkBody('email', "Invalid email").notEmpty().isEmail(); //Checking entered email is in email format
    req.checkBody('password','Invalid password' ).notEmpty();
    var errors=req.validationErrors();
    if(errors){
      var messages=[]
      errors.forEach(function(error){
        messages.push(error);
      });
      return done(null,false,req.flash('error',messages)); //setting error in req flash.
    }
    //Finding user with email in database
    User.findOne({'email':email}, function(err,user){
      if(err){
        return done(err);
      }
      //if user is not there .
      if(!user){
        return done(null,false,{message: "User not found"}); //false is telling passport that signup is not successful
      }
      //if password is wrong
      if(!user.validPassword(password)){
        return done(null,false,{message: "Wrong password"});
      }
      return done(null,user);
    });
}));
