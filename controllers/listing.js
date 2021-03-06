var ListingModel = require("../models/listing")
  , Listing = ListingModel.Listing
  , ListingPhoto = ListingModel.ListingPhoto
  , listings_per_page = 10
  , ObjectId = require('mongoose').Types.ObjectId
  , async  = require('async')
  , Alleup = require('alleup')
  , alleup = new Alleup({storage : "dir", config_file: "alleup_config.json"});

exports.showListing = function(req, res) {
  Listing.findOne({ '_id': req.params.id }).populate('_owner').exec(function (err, listing) {
    if(listing) {
      res.render('listing', { title: 'Listing', listing: listing });
      console.log(listing);
    } else { res.redirect('/'); }
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
  Listing.findOne({ '_id': req.params.listing_id, '_owner': req.user._id }, function (err, listing) {
    if(listing)
    {
      res.render('addListingPhotos', { title: 'Add Photos', listing_id: req.params.listing_id });
    } else { res.redirect('/'); }
  });
};

exports.editPhotos = function(req, res){
  Listing.findOne({ '_id': req.params.listing_id, '_owner': req.user._id }, function (err, listing) {
    if(listing)
    {
      res.render('addListingPhotos', { title: 'Edit Photos', listing_id: req.params.listing_id, edit_listing: true });
    } else { res.redirect('/'); }
  });
};

exports.uploadPhoto = function(req, res) {
  Listing.findOne({ '_id': req.body.listing_id, '_owner': req.user._id }, function (err, listing) {
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
            result.name = listingphoto.name;
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
            listing.visible = 1;
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
      listing.photos.forEach(function(photo){
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
  deletePhoto(photo_id,req.user._id, function(err)  {
    res.json({ success: 'Photo has been deleted' });
  });
};

function deletePhoto(photo_id,user_id,callback) {
  Listing.findOne({ 'photos._id': photo_id, '_owner':user_id }, function(err, listing) {
    if(listing) {
      if(listing.photos.length <= 1) { listing.visible = false; }
      var photo = listing.photos.id(photo_id);
      var photo_name = photo.name;
      photo.remove();
      listing.save(function (err, listing) { 
        alleup.remove(photo_name, function(err) {
          callback(err);
        });
      });
    }
  });
}

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
    listing._owner = user._id;
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
 
exports.editListing = function(req, res) {
  Listing.findOne({ '_id': req.params.id, '_owner': req.user._id }, function (err, listing) {
    if(listing)
    {
      res.render('addListing', { title: 'Edit Listing', listing: listing });
    } else { res.redirect('/'); }
  });
};

exports.updateListing = function(req, res) {
  Listing.findOne({ '_id': req.params.id, '_owner': req.user._id }, function (err, listing) {
    if(listing)
    {
      listing.title = req.body.title;
      listing.price = req.body.price;
      listing.description = req.body.description;
      listing.brand = req.body.brand;
      listing.condition = req.body.condition;
      listing.save(function (err, lstng) {
        if (!err){ 
          res.redirect('/listings/edit/photos/'+listing._id);
        }
        else { 
          res.render('addListing', { title: 'Add Listing', listing: listing, 'error': 'An error has occurred' });
        }
      });
    } else { res.redirect('/'); }
  });
}; 

exports.deleteListing = function(req, res) {
  var user_id = req.user._id;
  Listing.findOne({ '_id': req.params.id, '_owner': user_id }, function (err, listing) {
    if(listing)
    {
      listing.photos.forEach(function(photo){
        deletePhoto(photo._id, user_id, function(err){
          
        });
      });
      listing.remove();
      res.json({ success: 'Listing has been deleted.' });
    } else { res.json({ error: 'Listing could not be deleted.' }); }
  });
};

exports.myListings = function(req, res) {
  Listing.find({ '_owner': req.user._id }, function (err, listings) {
    res.render('myListings', { title: 'My Listings', listings: listings });
  });
};

exports.search = function(req, res) {
  var page = 0;
  Listing.search({'titlesearch':'listing'},{} , {}, {score:true, skip: page, limit: 20 }, function (err, results) {
        if (err) {
            console.log(err);
        } else {
          res.json(results.sort());
        }      
  });
};