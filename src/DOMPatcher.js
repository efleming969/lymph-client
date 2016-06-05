var R = require( "ramda" )

var getChildNodes = function getChildNodes( node ) {
  return Array.prototype.slice.call( node.childNodes )
}

var getNodeIndex = function getNodeIndex( node ) {
  var i = 0

  while( node ) {
    node = node.previousSibling
    i++
  }

  return i
}

var getChildAtIndex = function getChildAtIndex( parent, index ) {
  return getChildNodes( parent )[ index ]
}

var without = function without( arr, value ) {
  var index = arr.indexOf(value)

  if( index > -1 )
    arr.splice( index, 1 )

  return arr
}

var Patch = function Patch() {
  this.operation = arguments[ 0 ]
  this.args = Array.prototype.slice.call( arguments ).slice( 1 )
}

Patch.REMOVE = "REMOVE"
Patch.REPLACE = "REPLACE"
Patch.INSERT = "INSERT"
Patch.CHANGEPROPERTY = "CHANGEPROPERTY"
Patch.CHANGESTYLE = "CHANGESTYLE"

var patchNode = function patchNode( command ) {
  switch( command.operation ) {
    case Patch.REMOVE:
      remove( command.args )
      break
    case Patch.REPLACE:
      replace( command.args )
      break
    case Patch.INSERT:
      insert( command.args )
      break
    case Patch.CHANGEPROPERTY:
      changeProperty( command.args )
      break
    case Patch.CHANGESTYLE:
      changeStyle( command.args )
      break
  }
}

var remove = function remove( args ) {
  var node = args[ 0 ] 
  node.parentNode && node.parentNode.removeChild( node )
}

var replace = function replace( args ) {
  var nodeA = args[ 0 ]
  var nodeB = args[ 1 ]
  nodeA.parentNode && nodeA.parentNode.replaceChild( nodeB, nodeA )
}

var insert = function insert( args ) {
  var parent = args[ 0 ]
  var node = args[ 1 ]
  var index = args [ 2 ]

  if( index !== -1 ) {
    parent
      && parent.removeChild( node )
      && parent.insertBefore( node, getChildAtIndex( parent, index ) )
  } else {
    parent && parent.appendChild( node )
  }
}

var changeProperty = function changeProperty( args ) {
  var node = args[ 0 ]
  var propName = args[ 1 ]
  var value = args[ 2 ]

  node[ propName ] = value
}

var changeStyle = function changeStyle( args ) {
  var node = args[ 0 ]
  var styleName = args[ 1 ]
  var styleValue = args[ 2 ]

  node.style[ styleName ] = styleValue
}

var isDiffType = function( a, b ) {
  return a.nodeType !== b.nodeType
    || a.tagName !== b.tagName
}

var diff = function diff( a, b ) {
  if( a.isEqualNode( b ) ) {
    return diffProperties( a, b ).concat( diffChildren( a, b ) )
  }

  if( isDiffType( a, b ) ) {
    return [ new Patch( Patch.REPLACE, a, b ) ]
  }

  return diffProperties( a, b ).concat( diffChildren( a, b ) )
}

var PROPS = [
  "value", "disabled", "selected", "checked", "href", "data", "state", "className",
  "styles"
]

var diffProperties = function diffProperties( a, b ) {
  var patches = []

  PROPS.forEach( function( prop ) {
    var aProp = a[ prop ]
    var bProp = b[ prop ]

    if( prop === "styles" && aProp && bProp ) {
      Object.keys( bProp ).forEach( function( bStyle ) {
        if( aProp[ bStyle ] || aProp[ bStyle ] !== bProp[ bStyle ] ) {
          patches.push( new Patch( Patch.CHANGESTYLE, a, bStyle, bProp[ bStyle ] ) )
        }
      } )
      patches.push( new Patch( Patch.CHANGEPROPERTY, a, prop, bProp ) )
    } else if( aProp !== bProp ) {
      patches.push( new Patch( Patch.CHANGEPROPERTY, a, prop, bProp ) )
    }
  } )

  return patches
}

var diffChildren = function diffChildren( a, b ) {
  var patches = []
  var aChilds = getChildNodes( a )
  var bChilds = getChildNodes( b )
  var aRemaining = [].concat( aChilds )
  var bRemaining = [].concat( bChilds )
  var insertPatches = []

  var remaining = [].concat( bRemaining )

  aRemaining.forEach( function( aChild ,aI ) {
    var bChild = bRemaining[ aI ]

    if( bChild === undefined ) {
      return patches.push( new Patch( Patch.REMOVE, aChild ) )
    }

    patches = patches.concat( diff( aChild, bChild ) )

    without( remaining, bChild )
  } )

  remaining.forEach( function( bChild ) {
    patches.push( new Patch( Patch.INSERT, a, bChild, -1 ) )
  } )

  return patches.concat( insertPatches )
}

exports.run = function( nodeA, nodeB ) {
  diff( nodeA, nodeB ).forEach( patchNode )
  return nodeA
}

