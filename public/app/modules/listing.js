// Listing module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Listing = app.module();

  // Default Model.
  Listing.Model = Backbone.Model.extend({
  
  });

  // Default Collection.
  Listing.Collection = Backbone.Collection.extend({
    model: Listing.Model
  });

  // Default View.
  Listing.Views.Layout = Backbone.Layout.extend({
    template: "listing"
  });

  // Return the module for AMD compliance.
  return Listing;

});
