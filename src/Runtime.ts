import * as DOM from "./DOM"
import * as Utils from "./Utils"
import { WindowEnvironment } from "./Environment"

export const run = function ( window, app_component, app_name ) {
    const environment = new WindowEnvironment( window )
    const context = Utils.createContext()
    const app = context.createComponent( app_component, app_name )

    let [ viewState, command ] = app.init( window.location.hash.slice( 1 ) )

    console.group( "%c", "color: gray; font-weight: lighter;", ":init" )
    console.log( "%c next state", "color: #4CAF50; font-weight: bold;", viewState )
    console.log( "%c commands", "color: #4CAF50; font-weight: bold;", command )
    console.groupEnd()

    let view = app.render( viewState )

    const lymph_config = window[ "lymphConfig" ] || {
        actionName: "action"
    }

    window.addEventListener( lymph_config.actionName, function ( e: CustomEvent ) {
        console.group( "%c", "color: gray; font-weight: lighter;", e.detail.name )

        console.log( "%c prev state", "color: #9E9E9E; font-weight: bold;", viewState )
        console.log( "%c message", "color: #03A9F4; font-weight: bold;", e.detail )

        const [ state, command ] = app.update( e.detail, viewState )

        console.log( "%c next state", "color: #4CAF50; font-weight: bold;", state )
        console.log( "%c commands", "color: #4CAF50; font-weight: bold;", command )

        viewState = state
        view = app.render( viewState )

        DOM.updateChildren( window, window.document.body, view )

        command.executeIn( environment )

        console.groupEnd()
    } )

    window.addEventListener( "hashchange", function ( e ) {
        window.document.dispatchEvent(
            new window[ "CustomEvent" ]( lymph_config.actionName, {
                detail: { name: `:route-changed`, data: window.location.hash.slice( 1 ) },
                bubbles: true,
                cancelable: true
            } )
        )
    } )

    // because we never want to do standard submits in SPAs
    window.document.addEventListener( "submit", e => e.preventDefault(), true )

    DOM.updateChildren( window, window.document.body, view )

    command.executeIn( environment )
}