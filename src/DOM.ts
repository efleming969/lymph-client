const createNodeFrom = function ( window: Window, spec ) {
    let element = null

    if ( typeof spec === "string" ) {
        element = window.document.createTextNode( spec )
    } else {
        element = window.document.createElement( spec.tagName )

        updateProperties( window, element, spec )

        for ( let i = 0, len = spec.children.length; i < len; i++ ) {
            element.appendChild( createNodeFrom( window, spec.children[ i ] ) )
        }
    }

    return element
}

export const updateChildren = function ( window: Window, oldNode, spec ) {
    let oldLength = oldNode.childNodes.length
    let newLength = spec.children.length

    for ( let i1 = 0; i1 < newLength; i1++ ) {
        patch( window, oldNode, oldNode.childNodes[ i1 ], spec.children[ i1 ] )
    }

    for ( let i2 = 0; i2 < (oldLength - newLength); i2++ ) {
        oldNode.removeChild( oldNode.lastChild )
    }
}

const updateProperties = function ( window: Window, oldNode, spec ) {
    if ( oldNode._properties ) {
        for ( let propName of oldNode._properties ) {
            if ( propName.startsWith( "on" ) )
                oldNode[ propName ] = function () {
                }
        }
    }

    oldNode._properties = []

    for ( let propName in spec.properties ) {
        oldNode._properties.push( propName )
        if ( propName.startsWith( "on" ) ) {
            oldNode[ propName ] = (function ( [ name, data ] ) {
                return function ( event ) {
                    this.dispatchEvent(
                        new window[ "CustomEvent" ]( "action", {
                            detail: { name, data, event },
                            bubbles: true,
                            cancelable: true
                        } )
                    )
                }
            })( spec.properties[ propName ] )
        }
        else if ( oldNode[ propName ] !== spec.properties[ propName ] ) {
            oldNode[ propName ] = spec.properties[ propName ]
        }
    }
}

export const patch = function ( window: Window, parent, oldNode, spec ) {
    if ( oldNode === undefined ) {
        parent.appendChild( createNodeFrom( window, spec ) )
    }
    else {
        if ( typeof spec === "string" && oldNode.nodeType === Node.TEXT_NODE ) {
            if ( oldNode.nodeValue !== spec ) {
                oldNode.nodeValue = spec
            }
        }
        else if ( oldNode.nodeType === Node.ELEMENT_NODE ) {
            if ( oldNode.tagName !== spec.tagName ) {
                parent.replaceChild( createNodeFrom( window, spec ), oldNode )
            }
            else {
                updateProperties( window, oldNode, spec )
                updateChildren( window, oldNode, spec )
            }
        }
        else if ( oldNode.nodeType === Node.TEXT_NODE ) {
            parent.replaceChild( createNodeFrom( window, spec ), oldNode )
        }
        else {
            throw "unknown node"
        }
    }
}
