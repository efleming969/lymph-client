var HTML = require( './HTML' )
var DOMPatcher = require( './DOMPatcher' )

var createFromHTML = function( html ) {
  var container = document.body
  container.innerHTML = html
  return container.firstChild
}

module.exports = {

  '_': function( test ) {

    test( {

      'patch the text of a given node': function( assert ) {
        var node = createFromHTML( '<p>old</p>' )
        var vnode = HTML.create( 'p', {}, [ 'new' ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<p>new</p>' ]
        } )

      }

    , 'patch a full body': function( assert ) {
        document.body.innerHTML = '<p>old</p>'
        var vnode = HTML.create( 'body', {}, [ HTML.create( 'p', {}, [ 'new' ] ) ] )

        DOMPatcher.patch( document.body, vnode )

        assert( {
          '': [ document.body.outerHTML, '<body><p>new</p></body>' ]
        } )

      }
    , 'replaces existing element if different type': function( assert ) {
        var node = createFromHTML( '<p>foobar</p>' )
        var vnode = HTML.create( 'span', {}, [ 'foobar' ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [  document.body.innerHTML , '<span>foobar</span>' ]
        } )
      }

    , 'remove child elements from existing element': function( assert ) {
        var node = createFromHTML(
            '<ul><li>one</li><li>two</li><li>three</li></ul>' )

        var vnode = HTML.create( 'ul', {}
            , [ HTML.create( 'li', {}, [ 'one' ] ) ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<ul><li>one</li></ul>' ]
        } )
      }

    , 'adding elements to an existing tree': function( assert ) {
        var node = createFromHTML(
            '<ul><li>one</li></ul>' )

        var vnode = HTML.create( 'ul', {}
            , [ HTML.create( 'li', {}, [ 'one' ] )
              , HTML.create( 'li', {}, [ 'two' ] )
              ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<ul><li>one</li><li>two</li></ul>' ]
        } )
      }

    , 'change text of a nested node': function( assert ) {
        var node = createFromHTML( '<span><strong>old</strong></span>' )

        var vnode = HTML.create( 'span', {}, [ HTML.create( 'strong', {}, [ 'new' ] ) ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<span><strong>new</strong></span>' ]
        } )
      }

    , 'add className property to an element without one': function( assert ) {
        var node = createFromHTML( '<span></span>' )

        var vnode = HTML.create( 'span', { className: 'new' }, [] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<span class="new"></span>' ]
        } )
      }

    , 'escape text to allow for embedded html': function( assert ) {
        var node = createFromHTML( '<div></div>' )

        var vnode = HTML.create( 'div', {}, [ '<p>hello</p>' ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<div><p>hello</p></div>' ]
        } )
      }

    , 'convert numbers to string for text content': function( assert ) {
        var node = createFromHTML( '<div></div>' )

        var vnode = HTML.create( 'div', {}, [ 10 ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<div>10</div>' ]
        } )
      }

    , 'update existing text content with a number': function( assert ) {
        var node = createFromHTML( '<div>10</div>' )

        var vnode = HTML.create( 'div', {}, [ 11 ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<div>11</div>' ]
        } )
      }

    , 'setting the id property of an element': function( assert ) {
        var node = createFromHTML( '<button>clicker</button>' )

        var vnode = HTML.create( 'button', { id: 'btn' }, [ 'clicker' ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<button id="btn">clicker</button>' ]
        } )
      }

    , 'same node with different id should be replaced': function( assert ) {
        var node = createFromHTML( '<div id="d1" class="foo">d1</div>' )

        var vnode = HTML.create( 'div', { id: 'd2' }, [ 'd1' ] )

        DOMPatcher.patch( node, vnode )

        assert( {
          '': [ document.body.innerHTML, '<div id="d2">d1</div>' ]
        } )
      }

    , 'body with text nodes': function( assert ) {
        document.body.innerHTML = `
          <header>braintrust</header>
        `

        var vnode = HTML.create( 'body', {}
            , [ HTML.create( 'header', {}, [ 'braintrust' ] ) ] )

        DOMPatcher.patch( document.body, vnode )

        assert( {
          '': [ document.body.innerHTML, '<header>braintrust</header>' ]
        } )
      }

    } )

  }

, 'events': function( test ) {

    test( {

      'replace existing events': function( assert ) {

        var log = []

        var clicker1 = function( state ) {
          return function() { 
            log.push( [ 'clicker1', state ] )
            DOMPatcher.patch( document.body, render( { mode: '2', text: 'hello2' } ) )
          }

        }

        var clicker2 = function( state ) {
          return function() { log.push( [ 'clicker2', state ] ) }
        }

        var render = function( state ) {
          if ( state.mode == '1' ) {
            return HTML.create( 'body', {}
                , [ HTML.create( 'div', {}
                      , [ HTML.create( 'button'
                            , { id: 'btn1', on: { click: clicker1( state ) } }, [ 'btn1' ] )
                        ] )
                  ] )
                }
          else {
            return HTML.create( 'body', {}
                , [ HTML.create( 'div', {}
                      , [ HTML.create( 'button'
                            , { id: 'btn2', on: { click: clicker2( state ) } }, [ 'btn2' ] )
                        ] )
                  ] )
          }
        }

        DOMPatcher.patch( document.body, render( { mode: '1', text: 'hello1' } ) )

        document.getElementById( 'btn1' ).click()
        document.getElementById( 'btn2' ).click()

        assert( {
          '': [ log
                , [ ['clicker1', {mode:'1',text:'hello1'}]
                  , ['clicker2', {mode:'2',text:'hello2'}]
                  ]
              ]
        } )

      }

    } )

  }

}

