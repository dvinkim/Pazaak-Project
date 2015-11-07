var express = require('express');
var passport = require('passport');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('./db');
require('./auth');
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var play = require('./routes/play');
var shop = require('./routes/shop');
var highscores = require('./routes/highscores');
var howtoplay = require('./routes/howtoplay');

var app = express();

//session stuff
var session = require('express-session');
var sessionOptions = {
secret: 'meep',
resave: true,
saveUninitialized: true
};
app.use(session(sessionOptions));

//passport stuff
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
res.locals.user = req.user;
next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/register',register);
app.use('/play', play);
app.use('/shop', shop);
app.use('/highscores', highscores);
app.use('/howtoplay', howtoplay);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
