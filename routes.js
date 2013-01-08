app = module.parent.exports.app;

var homeController = require('./controllers/home')
  , userController = require('./controllers/user')
  , listingController = require('./controllers/listing');


app.get('/about', homeController.about);

app.get('/listings', listingController.findAll);
app.get('/listings/:id', listingController.findById);
app.post('/listings', listingController.addListing);
app.put('/listings/:id', listingController.updateListing);
app.delete('/listings/:id', listingController.deleteListing);

app.get('/users', userController.list);