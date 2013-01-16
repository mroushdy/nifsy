/*
 * GET users listing.
 */

/*
* Enable if you want users to both signup with facebook and create an account

exports.addUser = function(req, res){
  var account = req.session.account;
	if(account) {
    res.render('signup', { title: 'Join Nifsy' , account: account});
  } else {
    res.redirect('/connect/facebook');
  }
};
*/