/*
 * GET home page.
 */
 
var ListingModel = require("../models/listing").Listing
exports.home = function(req, res){
	ListingModel.find().lean().exec(function(err, listings) {
    res.render('home', { title: 'home' , listings: listings});
  });
  
};

exports.addListing = function(req, res){
  res.render('addListing', { title: 'Add Listing' });
};
