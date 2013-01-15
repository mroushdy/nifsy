app = module.parent.exports.app;

var homeController = require('./controllers/home')
  , userController = require('./controllers/user')
  , listingController = require('./controllers/listing')
  , passport = require('passport')
  , authController = require('./controllers/auth');


app.get('/', homeController.home);

app.get('/connect/facebook', passport.authorize('facebook', { failureRedirect: '/account' }));
app.get('/connect/facebook/callback', passport.authorize('facebook', { failureRedirect: '/account' }), authController.authorizeFacebookCallBack);

app.get('/listings/new', homeController.addListing);
app.get('/listings', listingController.findAll);
app.get('/listings/:id', listingController.findById);
app.post('/listings', listingController.addListing);
app.put('/listings/:id', listingController.updateListing);
app.delete('/listings/:id', listingController.deleteListing);

app.get('/users', userController.list);