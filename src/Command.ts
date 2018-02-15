import HTTP from "./HTTP"
import * as Utils from "./Utils"

export const process = function ( window, command ) {
    const http = new HTTP( window.fetch )
    const dispatchAction = Utils.dispatchAction( window )

    if ( command != null ) {
        if ( command.type === "execute" ) {
            http.execute( command.url, command.data, command.token ).then( function ( response ) {
                dispatchAction( {
                    name: command.action,
                    data: { body: response.data, status: response.status }
                } )
            } )
        }
        else if ( command.type === "query" ) {
            http.query( command.url, command.token ).then( function ( response ) {
                dispatchAction( {
                    name: command.action,
                    data: { body: response.data, status: response.status }
                } )
            } )
        }
        else if ( command.type === "load" ) {
            setTimeout( function () {
                const data = JSON.parse( window.localStorage.getItem( command.location ) )
                dispatchAction( { name: command.action, data } )
            }, 0 )
        }
        else if ( command.type === "save" ) {
            setTimeout( function () {
                window.localStorage.setItem( command.location, JSON.stringify( command.data ) )
                if ( command.action )
                    dispatchAction( { name: command.action } )
            }, 0 )
        }
        else if ( command.type === "redirect" ) {
            console.log( "redirecting", command.path )
            setTimeout( function () {
                window.location.assign( command.path )
            }, 0 )
        }
        // else if ( window.config.commands && window.config.commands[ command.type ] ) {
        //     window.config.commands[ command.type ]( command )
        // }
    }
}

export const execute = function ( url, data, action, token? ) {
    return { type: "execute", url, data, action, token }
}

export const query = function ( url, action, token? ) {
    return { type: "query", url, action, token }
}

export const redirect = function ( path ) {
    return { type: "redirect", path }
}

export const load = function ( location, action ) {
    return { type: "load", location, action }
}

export const save = function ( location, data, action? ) {
    return { type: "save", location, data, action }
}

