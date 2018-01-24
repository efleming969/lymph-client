import * as JSDOM from "jsdom"

import * as DOM from "./DOM"

export const createTarget = function ( html ) {
    const template = `<!DOCTYPE html><head></head><body>${ html }</body>`
    const document = new JSDOM.JSDOM( template ).window.document
    return document.body.firstChild
}

export const createWindow = function () {
    const template = `<!DOCTYPE html><head></head><body></body>`
    return new JSDOM.JSDOM( template ).window
}

export const createTestContext = function () {
    const window = createWindow()

    return {
        onAction: function ( callback ) {
            window.document.addEventListener( "action", function ( e: CustomEvent ) {
                const { name, data, event } = e.detail
                event.preventDefault()
                callback( name, data, event )
            } )
        },

        dispatch: function ( event_type, selector ) {
            const event = event_type === "click" ?
                new window.MouseEvent( "click", {
                    bubbles: true,
                    cancelable: true
                } ) : new window.Event( event_type )

            window.document.querySelector( selector ).dispatchEvent( event )
        },

        render: function ( view ) {
            DOM.updateChildren( window, window.document.body, view )
        },

        find: function ( selector ) {
            return window.document.querySelector( selector )
        }
    }
}

export const createFakeFetch = function ( response ) {
    return function ( url, options ) {
        return new Promise( function ( res, rej ) {
            const responseToForward = {
                status: response.status,
                json: () => Promise.resolve( response.data )
            }

            if ( url === "/api/post1" || url === "/api/get1" ) {
                res( responseToForward )
            }
            else {
                rej( responseToForward )
            }
        } )
    }
}

