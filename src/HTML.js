var R = require( "ramda" )

var toNameValuePair = function( obj ) {
  return function( key ) {
    return key + ":" + obj[ key ]
  }
}

exports.create = function( tagName, properties, children ) {
  var el = document.createElement( tagName )
  var properties = properties || {}
  var children = children || []

  Object.keys( properties ).forEach( function( propKey ) {
    if( propKey === "on" ) {
      Object.keys( properties.on ).forEach( function( onKey ) {
        el.addEventListener( onKey, properties.on[ onKey ], false )
      } ) 
    } else if( propKey === "styles" ) {
      Object.keys( properties.styles ).forEach( function( styleKey ) {
        el.style[ styleKey ] = properties.styles[ styleKey ]
      } )
    }

    el[ propKey ] = properties[ propKey ]
  } )

  children.forEach( function ( child ) {
    if( typeof child === "string" ) {
      if( child.indexOf( "!" ) === 0 ) {
        el.innerHTML = child.slice( 1 )
      } else {
        el.appendChild( document.createTextNode( child ) )
      }
    }
    else if( typeof child === "number" ) {
      el.appendChild( document.createTextNode( String( child ) ) )
    }
    else {
      el.appendChild( child )
    }
  } )

  return el
}

