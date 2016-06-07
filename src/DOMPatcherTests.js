var HTML = require( './HTML' )
var DOMPatcher = require( './DOMPatcher' )

exports[ 'DOM Patching' ] = function( test ) {

  var createContainerWithInnerHTML = function( html ) {
    var container = document.getElementById( 'container' )
    container.innerHTML = html
    return container
  }

  test( {

    'sanity': function( assert ) { assert( { '': [ true ] } ) }

  , 'replaces contents of an empty container': function( assert ) {
      var container = createContainerWithInnerHTML( '' )

      var vnode = HTML.create( 'p', {}, [ 'new' ] )

      DOMPatcher.patch( container, vnode )

      assert( {
        '': [ container.innerHTML, '<p>new</p>' ]
      } )
    }

  , 'replaces existing element if different type': function( assert ) {
      var container = createContainerWithInnerHTML( '<p>foobar</p>' )

      var vnode = HTML.create( 'span', {}, [ 'foobar' ] )

      DOMPatcher.patch( container, vnode )

      assert( {
        '': [ container.innerHTML, '<span>foobar</span>' ]
      } )
    }

  , 'remove child elements from existing element': function( assert ) {
      var rnode = createContainerWithInnerHTML(
          '<ul><li>one</li><li>two</li><li>three</li></ul>' )

      var vnode = HTML.create( 'ul', {}
          , [ HTML.create( 'li', {}, [ 'one' ] ) ]
          )

      DOMPatcher.patch( rnode, vnode )

      assert( {
        '': [ rnode.innerHTML, '<ul><li>one</li></ul>' ]
      } )
    }

  , 'adding elements to an existing tree': function( assert ) {
      var container = createContainerWithInnerHTML(
          '<ul><li>one</li></ul>' )

      var vnode = HTML.create( 'ul', {}
          , [ HTML.create( 'li', {}, [ 'one' ] )
            , HTML.create( 'li', {}, [ 'two' ] )
            ]
          )

      DOMPatcher.patch( container, vnode )

      assert( {
        '': [ container.innerHTML, '<ul><li>one</li><li>two</li></ul>' ]
      } )
    }

  , 'change text of an existing node': function( assert ) {
      var container = createContainerWithInnerHTML( '<span>old</span>' )

      var vnode = HTML.create( 'span', {}, [ 'new' ] )

      DOMPatcher.patch( container, vnode )

      assert( {
        '': [ container.innerHTML, '<span>new</span>' ]
      } )
    }

  , 'change text of a nested node': function( assert ) {
      var container = createContainerWithInnerHTML( '<span><strong>old</strong></span>' )

      var vnode = HTML.create( 'span', {}, [ HTML.create( 'strong', {}, [ 'new' ] ) ] )

      DOMPatcher.patch( container, vnode )

      assert( {
        '': [ container.innerHTML, '<span><strong>new</strong></span>' ]
      } )
    }

  , 'add className property to an element without one': function( assert ) {
      var container = createContainerWithInnerHTML( '<span></span>' )

      var vnode = HTML.create( 'span', { className: 'new' }, [] )

      DOMPatcher.patch( container, vnode )

      assert( {
        '': [ container.innerHTML, '<span class="new"></span>' ]
      } )
    }

  , 'escape text to allow for embedded html': function( assert ) {
      var container = createContainerWithInnerHTML( '<div></div>' )

      var vnode = HTML.create( 'div', {}, [ '<p>hello</p>' ] )

      DOMPatcher.patch( container, vnode )

      assert( {
        '': [ container.innerHTML, '<div><p>hello</p></div>' ]
      } )
    }

  , 'convert numbers to string for text content': function( assert ) {
      var container = createContainerWithInnerHTML( '<div></div>' )

      var vnode = HTML.create( 'div', {}, [ 10 ] )

      DOMPatcher.patch( container, vnode )

      assert( {
        '': [ container.innerHTML, '<div>10</div>' ]
      } )
    }

  , 'update existing text content with a number': function( assert ) {
      var container = createContainerWithInnerHTML( '<div>10</div>' )

      var vnode = HTML.create( 'div', {}, [ 11 ] )

      DOMPatcher.patch( container, vnode )

      assert( {
        '': [ container.innerHTML, '<div>11</div>' ]
      } )
    }

  } )
}

