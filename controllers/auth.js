/*
 * Handle authentication.
 */

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

var User = require("../models/user").User;

passport.serializeUser(function(user,done){
  done(null, user._id);
});
passport.deserializeUser(function(userId,done){
 User.findOne({_id: userId} ,function(err, user){
    done(err, user);
  });
});


/*
 * Enable and read docs if you want to user both username & password and facebook
passport.use(new LocalStrategy(
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
      email: profile._json.email,
      name: profile._json.name,
      birthday: profile._json.birthday,
      gender: profile._json.gender,
      token: accessToken
    }
		return done(null, account);
  }
));

exports.authorizeFacebookCallBack = function(req, res) {
  var account = req.account;
  if(account) {
    User.findOne( { "facebook_provider.uid": account.uid }, function(err, user) {
      if(req.user) {
        //if user is logged in but has no provider account link this provider account to his main account
        //used if two authentication methods are required. Currently only facebook auth is implemented.  
        res.redirect('/');
      } else if(user) {  
        //check if a user in the database has this provider account and log him in
        Login(req, res, user);
      } else {
        /* uncomment if you want to use both facebook and normal authentication. Sends user to enter a password.
        req.session.account = account;
        res.redirect('/users/new');
        */
        //new user create an account
        var user = new User();
        user.name = account.name;
        user.email = account.email;
        user.gender = account.gender;
        user.birthday = account.birthday;
        user.facebook_provider = {
          uid: account.uid,
          token: account.token
        };
        user.save(function (err, user) {
          Login(req, res, user);
        });
      }
    });
  } else { res.redirect('/'); } //fb connect was not succesful
}

function Login(req, res, user) {
  req.login(user, function(err) {
    return res.redirect('/');
  });
}

