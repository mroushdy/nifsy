app = module.parent.exports.app;

var homeController = require('./controllers/home')
  , userController = require('./controllers/user')
  , listingController = require('./controllers/listing')
  , passport = require('passport')
  , authController = require('./controllers/auth');


app.get('/', homeController.home);

app.get('/connect/facebook', passport.authorize('facebook', { scope: ['email','publish_actions', 'user_birthday'], failureRedirect: '/account' }));
app.get('/connect/facebook/callback', passport.authorize('facebook', { scope: ['email','publish_actions', 'user_birthday'], failureRedirect: '/account' }), authController.authorizeFacebookCallBack);

//logout from facebook also needs to be done as per facebook api terms
app.get('/logout', function(req, res){ req.logout(); res.redirect('/'); });

app.get('/listings/new', listingController.addListing);
app.post('/listings/new', listingController.createListing);

app.get('/listings/new/photos', listingController.addPhotos);
app.post('/listings/new/photos', listingController.uploadPhoto);

app.get('/listings', listingController.findAll);
app.get('/listings/:id', listingController.findById);
app.put('/listings/:id', listingController.updateListing);
app.delete('/listings/:id', listingController.deleteListing);