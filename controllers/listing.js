var ListingModel = require("../models/listing");
var Listing = ListingModel.Listing;
var ListingPhoto = ListingModel.ListingPhoto;
var listings_per_page = 10; 
var ObjectId = require('mongoose').Types.ObjectId
var async  = require('async');
var Alleup = require('alleup');
var alleup = new Alleup({storage : "dir", config_file: "alleup_config.json"});

exports.findById = function(req, res) {
  Listing.findOne({ '_id': req.params.id }, function (err, listing) {
    res.send(listing);
  });
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
  res.render('addListingPhotos', { title: 'Add Photos', listing_id: req.params.listing_id });
};

exports.uploadPhoto = function(req, res) {
  Listing.findOne({ '_id': req.body.listing_id, 'owner_id': req.user._id }, function (err, listing) {
    if(listing)
    {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        'Content-Type':'application/json'
      });

      var files_result = [];
      async.forEach(req.files.files
      , function(uploaded_file, callback){
          alleup.makeVariants(uploaded_file, function(err, saved_file){  //saved_file is the file name
            if(err) {
              callback(err);
              return;
            }
            
            var listingphoto = new ListingPhoto();
            listingphoto.name = saved_file;
            listing.photos.push(listingphoto);

            var result = {};
            result.size = uploaded_file.size;
            result.name = uploaded_file.name;
            result.delete_type = 'DELETE';
            result.thumbnail_url = listingphoto.thumbnail_url;
            result.url = listingphoto.url;
            result.delete_url = listingphoto.delete_url;
            files_result.push(result);
            callback(null);
          });
        }
      , function(err){
          if(err) {
            res.send({'error': 'The file is not an image.'});
          } else {

            listing.save(function (err, listing) { res.send({'files': files_result}); });
          }
      });
    } else { res.json(500, { error: 'The logged in user does not own this listing.' }); }
  });
};

exports.ajaxGetListingPhotos = function(req, res){
  var listing_id = req.params.listing_id;
  results = [];
  Listing.findOne({ '_id': listing_id}, function(err, listing) {
    if(listing) {
      listing.photos.forEach(function(photo, index, array){
        var result = {};
        result.delete_type = 'DELETE';
        result.thumbnail_url = photo.thumbnail_url;
        result.url = photo.url;
        result.delete_url = photo.delete_url;
        results.push(result); 
      });
      res.json({'files': results});
    }
  });
};

exports.addListing = function(req, res){
  res.render('addListing', { title: 'Add Listing' });
};

exports.deletePhoto = function(req, res){
  var photo_id = new ObjectId(req.params.id);
  Listing.findOne({ 'photos._id': photo_id, 'owner_id': req.user._id }, function(err, listing) {
    if(listing) {
      var photo = listing.photos.id(photo_id);
      var photo_name = photo.name;
      photo.remove();
      listing.save(function (err, listing) { 
        alleup.remove(photo_name, function(err) {
          res.json({ success: 'Photo has been deleted' })
        });
      });
    }
  });
};

exports.createListing = function(req, res) {
  user = req.user
  if(user) {
    var friends = [];
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
        res.redirect('/listings/new/photos/'+listing._id);
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