var R = require( 'ramda' )
var RF = require( 'ramda-fantasy' )

//  get :: String -> Future ProgressEvent
var get = exports.get = function( url )
{
  return new RF.Future(
      function(rej, res)
      {
        var oReq = new XMLHttpRequest()
        oReq.addEventListener( 'load', res, false )
        oReq.addEventListener( 'error', rej, false )
        oReq.addEventListener( 'abort', rej, false )
        oReq.open( 'get', url, true )
        oReq.send()
      }
    )
}

//  post :: RequestInfo -> Future ProgressEvent
var post = exports.post = function( requestInfo )
{
  return new RF.Future(
      function(rej, res)
      {
        var oReq = new XMLHttpRequest()
        oReq.addEventListener( 'load', res, false )
        oReq.addEventListener( 'error', rej, false )
        oReq.addEventListener( 'abort', rej, false )
        oReq.open( 'post', requestInfo.url, true )
        oReq.setRequestHeader( 'Content-Type', 'application/json' )
        oReq.send( JSON.stringify( requestInfo.data ) )
      }
    )
}

//  parseJSON :: ProgressEvent -> Object
var parseJSON = exports.parseJSON = function( pe )
{
  return JSON.parse( pe.target.responseText )
}

// getJSON :: String -> Future Object
var getJSON = exports.getJSON = R.pipe( get, R.map( parseJSON ) ) 

// postJSON :: RequestInfo -> Future Object
var postJSON = exports.postJSON = R.pipe( post, R.map( parseJSON ) )
