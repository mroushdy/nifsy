var mongoose = require("mongoose");

var ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true
  },
  /*owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },*/
  price: { type: Number },
  date: { type: Date, default: Date.now }
});

var Listing = mongoose.model('Listing', ListingSchema);

module.exports = {
  Listing: Listing
}

//usage in controllers
//var Listing = require("../models/listing").Listing;