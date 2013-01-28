var mongoose = require("mongoose");

var ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, index: true, required: true  },
  visible:  { type: Boolean, default: 0, required: true },
  price: { type: Number, required: true },
  condition: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  facebook_friends: [{type: String,  index:true}] //stores fb friend_ids
});

var Listing = mongoose.model('Listing', ListingSchema);

module.exports = {
  Listing: Listing
}

//usage in controllers
//var Listing = require("../models/listing").Listing;