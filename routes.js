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

//listing photos
app.get('/listings/new/photos/:listing_id', requireLogin, listingController.addPhotos);
app.get('/listings/ajax/getphotos/:listing_id', listingController.ajaxGetListingPhotos);
app.post('/listings/photos/upload', requireLogin, listingController.uploadPhoto);
app.delete('/listings/photos/delete/:id', requireLogin, listingController.deletePhoto);

//edit listings
app.get('/listings/edit/:id', requireLogin, listingController.editListing);
app.post('/listings/edit/:id', requireLogin, listingController.updateListing);
app.delete('/listings/:id', requireLogin, listingController.deleteListing);

//show listings
app.get('/listings/search', listingController.search);
app.get('/listing/:id', listingController.showListing);

//test route
app.get('/listings', listingController.findAll);

//ensure login middleware
function requireLogin(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
}