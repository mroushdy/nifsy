var app = module.parent.exports.app;

var express = require('express')
  , homeController = require('./controllers/home')
  , userController = require('./controllers/user')
  , listingController = require('./controllers/listing')
  , passport = require('passport')
  , authController = require('./controllers/auth');


app.get('/', homeController.home);

app.get('/connect/facebook', passport.authorize('facebook', { scope: ['email','publish_actions', 'user_birthday'], failureRedirect: '/account' }));
app.get('/connect/facebook/callback', passport.authorize('facebook', { scope: ['email','publish_actions', 'user_birthday'], failureRedirect: '/account' }), authController.authorizeFacebookCallBack);

//logout from facebook also needs to be done as per facebook api terms
app.get('/logout', function(req, res){ req.logout(); res.redirect('/'); });

//new listings
app.get('/listings/new', requireLogin, listingController.addListing);
app.post('/listings/new', requireLogin, listingController.createListing);

app.get('/listings/new/photos/:listing_id', requireLogin, listingController.addPhotos);

app.get('/listings/ajax/getphotos/:listing_id', listingController.ajaxGetListingPhotos);

app.post('/listings/photos/upload', requireLogin, listingController.uploadPhoto);
app.delete('/listings/photos/delete/:id', requireLogin, listingController.deletePhoto);

app.get('/listings', listingController.findAll);
app.get('/listing/:id', listingController.showListing);

//
app.put('/listings/:id', listingController.updateListing);
app.delete('/listings/:id', listingController.deleteListing);

//require login middleware. not tested yet
function requireLogin(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
}