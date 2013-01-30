var mongoose = require("mongoose")
  , Schema = mongoose.Schema;

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
  },
  facebook_friends: [{
    name: String,
    fb_id: String
  }]
});

UserSchema.virtual('first_name').get(function () {
  return this.name.split(/\b/)[0];
});

UserSchema.virtual('picture.profile').get(function () {
  return 'https://graph.facebook.com/' + this.facebook_provider.uid + "/picture?type=large"; //200px width variable height 
});

UserSchema.virtual('picture.navbar').get(function () {
  return 'https://graph.facebook.com/' + this.facebook_provider.uid + "/picture?width=20&height=20"; 
});

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}