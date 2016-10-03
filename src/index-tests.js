console.log( 'index-tests' )

var R = window.R = require( 'ramda' )
var LymphTest = require( 'lymph-test' )

var run = LymphTest.Core.run( LymphTest.BrowserLogging.logger )

run( 'DOMPatcher', require( './DOMPatcherTests' ) )

