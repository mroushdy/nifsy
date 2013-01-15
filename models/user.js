var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: { type: String, select: false }, //pull it in as needed in find and populate calls via field selection as '+password' 
  created: { type: Date, default: Date.now },
  image: String,
  providers: {
    name: String,
    uid: String,
    token: String
  }
});

var ProviderSchema = new mongoose.Schema({
  name: String,
  uid: String,
  token: String
});

var User = mongoose.model('User', UserSchema);

var Provider = mongoose.model('Provider', ProviderSchema);

module.exports = {
  User: User,
  Provider: Provider
}

//usage in controllers
//var Listing = require("../models/listing").Listing;