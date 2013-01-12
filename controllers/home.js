/*
 * GET home page.
 */

exports.about = function(req, res){
  res.render('home', { title: 'About me' })
};

exports.addListing = function(req, res){
  res.render('addListing', { title: 'Add Listing' })
};
