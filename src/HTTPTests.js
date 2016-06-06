var R = require( 'ramda' )
var HTTP = require( './HTTP' )

var logError = console.error.bind( console )

exports.tests =
  { 'given': function( when )
    {
      when(
        { 'when getting json data': function( then )
          {
            HTTP
              .getJSON( '/api' )
              .fork( logError
                , function( data )
                  {
                    then( { 'then': [ data, { value: 'api' } ] } )
                  }
                )
          }
        , 'when posting json data': function( then )
          {
            HTTP
              .postJSON( { url: '/api', data: { value: 'foo' } } )
              .fork( logError
                , function( data )
                  {
                    then( { 'then': [ data, { value: 'hello foo' } ] } )
                  }
                )

          }
        }
      )
    }
  }

