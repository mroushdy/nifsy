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
  }
});

var FBConnectionSchema = new mongoose.Schema({
  user_id: Schema.Types.ObjectId,
  friends: [{
    name: String,
    fb_id: String
  }]
});

UserSchema.virtual('picture.profile').get(function () {
  return 'https://graph.facebook.com/' + this.facebook_provider.uid + "/picture?type=large"; //200px width variable height 
});

UserSchema.virtual('picture.small').get(function () {
  return 'https://graph.facebook.com/' + this.facebook_provider.uid + "/picture?width=40&height=50"; 
});

var User = mongoose.model('User', UserSchema);
var FBConnection = mongoose.model('FBConnection', FBConnectionSchema);

module.exports = {
  User: User,
  FBConnection: FBConnection
}