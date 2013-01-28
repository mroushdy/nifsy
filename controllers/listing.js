var Listing = require("../models/listing").Listing;
var listings_per_page = 10; 
var async  = require('async');
var Alleup = require('alleup');
var alleup = new Alleup({storage : "dir", config_file: "alleup_config.json"})

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
  
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
    'Content-Type':'application/json'
  });

  var files = [];

  async.forEach(req.files.files
  , function(uploaded_file, callback){
      alleup.makeVariants(uploaded_file, function(err, saved_file){  //saved_file is the file name
        if(err) {
          callback(err);
          return;
        }
        // ToDo SAVE FILE TO DATABASE
        var result = {};
        result.size = uploaded_file.size;
        result.name = uploaded_file.name;
        result.delete_type = 'DELETE';
        result.thumbnail_url = alleup.url(saved_file, 'thumb').replace('./public/','');
        result.url = alleup.url(saved_file, 'version1').replace('./public/','');
        result.delete_url = '/listings/photos/delete/'+saved_file;
        files.push(result);
        callback(null);
      });
    }
  , function(err){
      if(err) {
        console.log(err);
        res.send({'error': 'The file is not an image.'});
      } else {
        res.send({'files': files});
      }
  });
};

exports.addListing = function(req, res){
  res.render('addListing', { title: 'Add Listing' });
};

exports.deletePhoto = function(req, res){
  var photo_name = req.params.id;
  alleup.remove(photo_name, function(err) {
    // THIS YOU CAN DELETE FILE FROM DATABASE FOR EXAMPLE
    res.end();
  });
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
    listing.price = req.body.price;
    listing.description = req.body.description;
    listing.brand = req.body.brand;
    listing.condition = req.body.condition;
    listing.owner_id = user._id;
    listing.facebook_friends = friends;
    listing.save(function (err, listing) {
      if (!err){ 
        res.redirect('/listings');
      }
      else { 
        res.render('addListing', { title: 'Add Listing', 'error': 'An error has occurred' });
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