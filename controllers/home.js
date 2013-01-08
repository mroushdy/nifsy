/*
 * GET home page.
 */


exports.about = function(req, res){
  res.render('home', { title: 'About me' })
};
