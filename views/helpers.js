/*
 * Initializes view helpers
 */

exports.Initialize = function(hbs){
  /*
   * Adds an extend helper to the view and a block helper to the layout
   * to allow for inserting block content in the layout
   */
  var hbs_blocks = {};

  hbs.registerHelper('extend', function(name, context) {
    var hbs_block = hbs_blocks[name];
    if (!hbs_block) {
      hbs_block = hbs_blocks[name] = [];
    }

    hbs_block.push(context.fn(this));
  });

  hbs.registerHelper('block', function(name) {
    var hbs_val = (hbs_blocks[name] || []).join('\n');

    // clear the block
    hbs_blocks[name] = [];
    return hbs_val;
  });
  
};