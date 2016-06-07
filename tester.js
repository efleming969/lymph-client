var HTTP = require( 'http' )
var Express = require( 'express' )
var BodyParser = require( 'body-parser' )

var Bundler = require( 'lymph-bundler' )

var app = Express()

app.use( BodyParser.json() )

app.get( '/'
  , function( req, res )
    {
      res.send( `
          <!doctype html>
          <body>
            <h1>Tester</h1>
            <div id="container"></div>
            <script src='/index.js'></script>
          </body>
      ` )
    }
  )

app.get( '/api'
  , function( req, res )
    {
      res.send( { value: 'api' } )
    }
  )

app.post( '/api'
  , function( req, res )
    {
      res.send( { value: 'hello ' + req.body.value } )
    }
  )

app.get( '/index.js', Bundler.create( './src/Tests.js' ) )

HTTP.createServer( app ).listen( 8081, function() { console.log( 'started' ) } )

