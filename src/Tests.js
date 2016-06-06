var TestCore = require( 'lymph-test/lib/Core' )
var ListLogger = require( 'lymph-test/lib/ListLogger' )

var listLogger = new ListLogger()
var runWithListLogger = TestCore.run( listLogger )

var whenDone = runWithListLogger( 'HTTPTests', require( './HTTPTests' ).tests )

whenDone( function() {
  console.log( '==' )
  listLogger.messages.forEach( x => console.log( x ) )
  console.log( '==' )
} )

