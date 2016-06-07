var TestCore = require( 'lymph-test/lib/Core' )
var ListLogger = require( 'lymph-test/lib/ListLogger' )
var BrowserLogger = require( 'lymph-test/lib/BrowserLogger' )

var logger = {
  log: function( msg, a, b ) {
    if ( a == undefined && b == undefined )
      console.log( msg )
    else
      console.log.apply( console, BrowserLogger.formatMessage( msg, a, b ) )
  }
}

var runWithListLogger = TestCore.run( logger )

// var whenDone = runWithListLogger( 'HTTPTests', require( './HTTPTests' ).tests )

// whenDone( function() {
//   console.log( '==' )
//   listLogger.messages.forEach( x => console.log( x ) )
//   console.log( '==' )
// } )

var whenDone = runWithListLogger( 'DOMPatcher', require( './DOMPatcherTests' ) )

whenDone( function() {
  console.log( 'done' )
} )

