var R = require( "ramda" )

exports.create = function( tagName, properties, children ) {
  return { tagName: tagName.toUpperCase(), properties: properties, children: children }
}

