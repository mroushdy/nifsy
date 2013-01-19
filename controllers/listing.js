var Listing = require("../models/listing").Listing;
var listings_per_page = 10; 

exports.findById = function(req, res) {
	//res.contentType('application/json');
	res.send('it works');
};
 
exports.findAll = function(req, res) {
  var page = req.param('p'); if (page == null) { page = 0; }
	ListingModel.find().skip(page*listings_per_page).limit(listings_per_page).lean().exec(function(err, listings) {
    if (!err){ 
      res.send(JSON.stringify(listings));
    }
    else { 
      res.send({'error':'An error has occurred'});
    }
  });
};


function listingsWithMutualFriends(user, listings, limit) {
  if(user.friends) {
    return listings.forEach(function(listing){
      listing.mutual_friends = [];
      for (var i = 0; i < user.friends.length; i++) {
        for (var z = 0; z < listing.fb_friends.length; z++) {
            var friend = user.friends[i];
            if (friend.fb_id == listing.fb_friends[z]) {
                listing.mutual_friends.push({name: friend.name, id: friend.fb_id});
                break;
            }
        }
        if(listing.mutual_friends>=limit) { break; }
      }
    });
  } else { return listings; }
}
 
exports.addImage = function(req, res) {
};

exports.addListing = function(req, res){
  res.render('addListing', { title: 'Add Listing' });
};

exports.createListing = function(req, res) {
  var listing = new Listing();
  listing.title = req.body.title;
  listing.price = 0;
  listing.save(function (err, listing) {
    if (!err){ 
      res.redirect('/listings');
    }
    else { 
      res.send({'error':'An error has occurred'});
    }
  });
};
 
exports.updateListing = function(req, res) {
	res.send('it works');
};
 
exports.deleteListing = function(req, res) {
	res.send('it works');
};