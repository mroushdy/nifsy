var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  gender: String,
  birthday: Date,
  //password: { type: String, select: false }, //uncomment if using normal authentication. //pull it in as needed in find and populate calls via field selection as '+password' 
  created: { type: Date, default: Date.now },
  facebook_provider: {
    uid: String,
    token: String
  }
});

UserSchema.virtual('picture.profile').get(function () {
  return 'https://graph.facebook.com/' + this.facebook_provider.uid + "/picture?type=large"; //200px width variable height 
});

UserSchema.virtual('picture.small').get(function () {
  return 'https://graph.facebook.com/' + this.facebook_provider.uid + "/picture?width=40&height=50"; 
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}

//usage in controllers
//var Listing = require("../models/listing").Listing;