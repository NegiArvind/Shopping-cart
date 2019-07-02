var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');
var session=require('express-session');
var expressHbs=require('express-handlebars');
var passport=require('passport');
var flash=require('connect-flash');
var validator=require('express-validator');
var MongoStore=require('connect-mongo')(session); //require returns a function which accepts one parameter.

var indexRouter = require('./routes/index');
var userRouter=require('./routes/user'); //Requiring user package in this module.


//We have to set everything to passport first before authentication is done in /user/signup page.
require('./config/passport'); // this will execute all the code of passport.js file from top to bottom and set everything to passport

var app = express();

//Connecting to mongoose database
mongoose.connect('mongodb://localhost:27017/shopping'); //need to write something here.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',expressHbs({defaultLayout: 'layout' , extname: '.hbs'})); //Setting default as layout.hbs file
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret',
  resave:false,
  saveUninitialized: false,
  store:new MongoStore({mongooseConnection: mongoose.connection}), //setting mongoose connection to MongoStore connection.
  cookie: {maxAge: 180*60*1000} //after 2 hours the session will be expired.
  }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(function(req,res,next){
  res.locals.login=req.isAuthenticated(); //making a local variable and the name is login(we can give any name
  res.locals.session=req.session; // making a local variable session so that it is available in views.
  next();
});

app.use('/user',userRouter); //if Any url starts with '/user' will get by server then userRouter code get executed.
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
