/*
 * Handle authentication.
 */

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

var User = require("../models/user").User;
var Provider = require("../models/user").Provider;

passport.serializeUser(function(user,done){
    done(null, user);
    console.log('serializing');
});
passport.deserializeUser(function(obj,done){
    console.log('deserializing');
    done(null, provider);
});


/*passport.use('facebook', new FacebookStrategy({
    clientID: '145309202292977',
    clientSecret: '6e77cc90af28863b24732685d53f6dd9',
    callbackURL: "http://localhost:3000/connect/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('x');
    done(null,profile);
  }
));*/


/*passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));*/


passport.use('facebook', new FacebookStrategy({
    clientID: 145309202292977,
    clientSecret: '6e77cc90af28863b24732685d53f6dd9',
    callbackURL: "http://localhost:3000/connect/facebook/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
		var account = {
      uid: profile.id,
      name: 'facebook',
      token: accessToken
    }
		return done(null, account);
  }
));

exports.authorizeFacebookCallBack = function(req, res) {
  var account = req.account;
  User.findOne( { providers: { uid: account.id, name: account.name } }, function(err, user) {
    if(user) { //check if a user in the database has this provider account and log him in
      req.login(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/users/' + req.user.username);
      });
    } else if(req.user) {  //if user is logged in but has no provider account link this provider account to his main account
        
    } else { //new user send him to create an account
      res.send(account);
    }
  });
}