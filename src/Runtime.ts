import * as DOM from "./DOM"
import * as Router from "./Router"
import * as Environment from "./Environment"

export const run = function ( window, app ) {
    const environment = new Environment.WindowEnvironment( window )

    let [ state, initial_command ] = app.init( window.location.hash.slice( 1 ) )

    console.group( "%c", "color: gray; font-weight: lighter;", ":init" )
    console.log( "%c next state", "color: #4CAF50; font-weight: bold;", state )
    console.log( "%c commands", "color: #4CAF50; font-weight: bold;", initial_command )
    console.groupEnd()

    let view = app.render( state )

    window.addEventListener( "action", function ( e: CustomEvent ) {
        console.group( "%c", "color: gray; font-weight: lighter;", e.detail.name )

        console.log( "%c prev state", "color: #9E9E9E; font-weight: bold;", state )
        console.log( "%c message", "color: #03A9F4; font-weight: bold;", e.detail )

        const [ new_state, command ] = app.handlers[ e.detail.name ]( e.detail, state )

        console.log( "%c next state", "color: #4CAF50; font-weight: bold;", new_state )
        console.log( "%c commands", "color: #4CAF50; font-weight: bold;", command )

        view = app.render( state = new_state )

        DOM.updateChildren( window, window.document.body, view )

        command.executeIn( environment )

        console.groupEnd()
    } )

    window.addEventListener( "hashchange", function ( e ) {
        window.document.dispatchEvent(
            new window[ "CustomEvent" ]( "action", {
                detail: {
                    name: Router.Events.Changed,
                    data: window.location.hash.slice( 1 )
                },
                bubbles: true,
                cancelable: true
            } )
        )
    } )

    // because we never want to do standard submits in SPAs
    window.document.addEventListener( "submit", e => e.preventDefault(), true )

    DOM.updateChildren( window, window.document.body, view )

    initial_command.executeIn( environment )
}
