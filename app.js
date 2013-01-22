
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , hbs = require('hbs')
  , passport = require('passport')
  , viewHelpers = require('./views/helpers')
  , viewPartials = require('./views/partials')
  , MongoStore = require('connect-mongo')(express);

//make config a global variable so that every module can see it
config = require('./config');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  app.use(express.logger('dev'));
  

  app.use(express.bodyParser());
  //use the two bottom ones instead of bodyparser to prevent file uploads on all routes and only on the routes that accept uploads 
  //app.use(express.json());
  //app.use(express.urlencoded());

  app.use(express.limit('4mb'));

  app.use(express.cookieParser());
  app.use(express.session({ secret: config.cookie_secret, store: new MongoStore(config.db) }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  
  //Important to make user available in views. ***MUST BE PLACED BEFORE APP.ROUTER
  app.use(function(req, res, next){ res.locals.user = req.user; next(); });

  //app.router must come after anything related to sessions.
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Initializes handlebars partials and helpers 
 */
viewHelpers.Initialize(hbs);
viewPartials.Initialize(hbs);

mongoose.connect(config.db.host, config.db.db);
mongoose.connection.on('open', function () {
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});

/*
 * Exports the express app for other modules to use
 * all route matches go the routes.js file
 */
exports.app = app;
routes = require('./routes');

