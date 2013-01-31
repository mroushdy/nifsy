/*
 * GET home page.
 */
var Listing = require("../models/listing").Listing;

exports.home = function(req, res){
  Listing.find().populate('_owner').exec(function(err, listings) {
    res.render('home', { title: 'home' , listings: listings});
  });
};
