import * as Utils from "./Utils"
import * as HTTP from "./HTTP"

export const process = function ( window, commands ) {
    const dispatchAction = Utils.dispatchAction( window )
    const sendCommand = HTTP.sendCommand( window.fetch )
    const sendQuery = HTTP.sendQuery( window.fetch )

    if ( commands !== undefined ) {
        for ( let i = 0; i < commands.length; i++ ) {
            const command = commands[ i ]

            if ( command.type === "execute" ) {
                sendCommand( command.url, command.data, command.token ).then( function ( response ) {
                    dispatchAction( { name: command.action, data: response.data } )
                } )
            }
            else if ( command.type === "query" ) {
                sendQuery( command.url, command.token ).then( function ( response ) {
                    dispatchAction( { name: command.action, data: response.data } )
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
            else if ( window.config.commands && window.config.commands[ command.type ] ) {
                window.config.commands[ command.type ]( command )
            }
        }
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

