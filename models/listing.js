var mongoose = require("mongoose")
  , Fulltext = require("mongoose-fulltext")
  , Alleup = require('alleup')
  , alleup = new Alleup({storage : "dir", config_file: "alleup_config.json"});

var ListingPhotoSchema = new mongoose.Schema({
    name: String
});

ListingPhotoSchema.virtual('thumbnail_url').get(function() {
    return alleup.url(this.name, 'thumb').replace('./public/',''); //replace might be different for AWS.
});

ListingPhotoSchema.virtual('delete_url').get(function() {
    return '/listings/photos/delete/' + this._id;
});

ListingPhotoSchema.virtual('url').get(function() {
    return alleup.url(this.name, 'version2').replace('./public/',''); //replace might be different for AWS.
});

var ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, fulltext:true, searchfield:'titlesearch' },
  _owner: { type: mongoose.Schema.Types.ObjectId, index: true, required: true, ref: 'User'  },
  visible:  { type: Boolean, default: 0, required: true },
  price: { type: Number, required: true },
  condition: { type: String, required: true, enum: ['new', 'used'] },
  brand: { type: String, required: true, fulltext:true, searchfield:'brandsearch' },
  description: { type: String, required: true, fulltext:true, searchfield:'descriptionsearch' },
  date: { type: Date, default: Date.now, required: true },
  photos: [ListingPhotoSchema], //stores photo names but without variations
  facebook_friends: [{type: String,  index:true}] //stores fb friend_ids
});

Fulltext(ListingSchema,{indexfieldname:'sindex'});

var Listing = mongoose.model('Listing', ListingSchema);
var ListingPhoto = mongoose.model('ListingPhoto', ListingPhotoSchema);

module.exports = {
  Listing: Listing,
  ListingPhoto: ListingPhoto
}

//usage in controllers
//var Listing = require("../models/listing").Listing;