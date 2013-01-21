var Listing = require("../models/listing").Listing;
var listings_per_page = 10; 

exports.findById = function(req, res) {
	//res.contentType('application/json');
	res.send('it works');
};
 
exports.findAll = function(req, res) {
  var page = req.param('p'); if (page == null) { page = 0; }
	Listing.find().skip(page*listings_per_page).limit(listings_per_page).lean().exec(function(err, listings) {
    if (!err){ 
      listingsWithMutualFriends(req.user, listings, 4);
      res.send(JSON.stringify(listings));
    }
    else { 
      res.send({'error':'An error has occurred'});
    }
  });
};

//how to make sure that this doesnt cause an update since listings is passed by reference
function listingsWithMutualFriends(user, listings, limit) {
  if(user && user.facebook_friends) {
    listings.forEach(function(listing){
      if(listing.facebook_friends) {
        listing.mutual_friends = [];
        for (var i = 0; i < user.facebook_friends.length; i++) {
          for (var z = 0; z < listing.facebook_friends.length; z++) {
              var friend = user.facebook_friends[i];
              if (friend.fb_id == listing.facebook_friends[z]) {
                  listing.mutual_friends.push({name: friend.name, id: friend.fb_id});
                  break;
              }
          }
          if(listing.mutual_friends.length >= limit) { break; }
        }
      }
    });
  }
}

exports.addPhotos = function(req, res){
  res.render('addListingPhotos', { title: 'Add Photos' });
};

exports.uploadPhoto = function(req, res) {
  var photoName = req.files.userPhoto.name;
  var serverPath = '/uploads/' + photoName;
  require('fs').rename(req.files.userPhoto.path, '/Users/marwan/sites/nifsy/public/' + serverPath, function(error) {
    if(error) {
      require('fs').unlink(req.files.userPhoto.path, function (err) { 
        res.send({ error: 'Ah crap! File could not be moved' });
        return;
      });
    }
    res.send({ path: serverPath });
  });
};

exports.addListing = function(req, res){
  res.render('addListing', { title: 'Add Listing' });
};

exports.createListing = function(req, res) {
  user = req.user
  if(user) {
    var friends = [];
    console.log(user);
    for (var i = 0; i < user.facebook_friends.length; i++) {
      friends.push(user.facebook_friends[i].fb_id);
    }
    var listing = new Listing();
    listing.title = req.body.title;
    listing.price = 0;
    listing.facebook_friends = friends;
    listing.save(function (err, listing) {
      if (!err){ 
        res.redirect('/listings');
      }
      else { 
        res.send({'error':'An error has occurred'});
      }
    });
  } else { res.redirect('/'); }
};
 
exports.updateListing = function(req, res) {
	res.send('it works');
};
 
exports.deleteListing = function(req, res) {
	res.send('it works');
};