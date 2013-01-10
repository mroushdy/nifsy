/*
 * Initializes view partials
 */
var fs = require('fs');

exports.Initialize = function(hbs){
  hbs.registerPartial('partial', fs.readFileSync(__dirname + '/partials/partial.hbs', 'utf8'));  
};