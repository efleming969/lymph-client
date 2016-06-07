var PROPS = [
  "value", "disabled", "selected", "checked", "href", "data", "state", "className",
  "styles", "id"
]

var createElement = function( spec ) {
  var properties = spec.properties
  var children = spec.children
  var el = document.createElement( spec.tagName )

  // Object.keys( properties ).forEach( function( propKey ) {
  //   if( propKey === "on" ) {
  //     Object.keys( properties.on ).forEach( function( onKey ) {
  //       el.addEventListener( onKey, properties.on[ onKey ], false )
  //     } ) 
  //   } else if( propKey === "styles" ) {
  //     Object.keys( properties.styles ).forEach( function( styleKey ) {
  //       el.style[ styleKey ] = properties.styles[ styleKey ]
  //     } )
  //   }

  //   el[ propKey ] = properties[ propKey ]
  // } )

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
      el.appendChild( createElement( child ) )
    }
  } )

  return el

}

var updateProperties = function( a, b ) {
  for ( var i = 0; i < PROPS.length; i++ ) {

    var propName = PROPS[ i ]

    var aPropValue = a[ propName ]
    var bPropValue = b.properties[ propName ]

    if ( bPropValue != undefined && bPropValue != aPropValue )
    {
      a[ propName ] = bPropValue
    }
  }
}

var removeChildren = function( a, b ) {
  var aLength = a.childNodes.length
  var bLength = b.children.length

  for( var i = aLength; i > bLength; i-- ) {
    a.removeChild( a.childNodes[ i - 1 ] )
  }
}

var insertChildren = function( a, b ) {
  var aLength = a.childNodes.length
  var bLength = b.children.length

  for ( var i = aLength; i < bLength; i++ ) {
    if ( typeof b.children[ i ] == 'string' ) {
      if ( b.children[ i ].indexOf( '!' ) ) {
        a.innerHTML = b.children[ i ].slice( 0 )
      }
      else {
        a.appendChild( document.createTextNode( b.children[ i ] ) )
      }
    }
    else if ( typeof b.children[ i ] == 'number' ) {
      a.appendChild( document.createTextNode( String( b.children[ i ] ) ) )
    }
    else {
      a.appendChild( createElement( b.children[ i ] ) )
    }
  }
}

var updateChildren = function( a, b ) {
  var aLength = a.childNodes.length

  for ( var i = 0; i < aLength; i++ ) {
    if ( a.childNodes[ i ].nodeType == 3 && typeof b.children[ i ] == 'string' ) {
      if ( a.childNodes[ i ].textContent != b.children[ i ] ) {
        a.replaceChild( document.createTextNode( b.children[ i ] ), a.childNodes[ i ] )
      }
    }
    else if ( a.childNodes[ i ].nodeType == 3 && typeof b.children[ i ] == 'number' ) {
      if ( a.childNodes[ i ].textContent != String( b.children[ i ] ) ) {
        a.replaceChild( document.createTextNode( String( b.children[ i ] ) ), a.childNodes[ i ] )
      }
    }
    else if ( a.childNodes[ i ].nodeType == 1 ) {
      update( a.childNodes[ i ], b.children[ i ] )
    }
    else {
      throw new Error( 'unsupported nodeType:' + a.childNodes[ i ].nodeType )
    }
  }
}

var update = function( a, b ) {
  removeChildren( a, b )

  updateProperties( a, b )
  updateChildren( a, b )

  insertChildren( a, b )
}

var patch = exports.patch = function( container, vnode ) {

  if ( container.childNodes.length == 0 ) {
    container.appendChild( createElement( vnode ) )
  }
  else if ( container.firstChild.tagName != vnode.tagName ) {
    container.replaceChild( createElement( vnode ), container.firstChild )
  }
  else {
    update( container.firstChild, vnode )
  }
}

