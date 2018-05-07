import { Utils, Runtime, Command } from "../src/LymphClient"
import { h1, main, form, input, button } from "../src/HTML"

const Actions = {
    Change: "change"
}

const create = function ( context ) {

    const handlers = {
        [ Actions.Change ]: function ( message, state ) {
            console.log( message )
            return [
                state,
                // Utils.merge( state, { message: message.data } ),
                Command.none
            ]
        }
    }

    const init = function () {
        return [
            { text: "Hello, World!" },
            Command.none
        ]
    }

    const render = function ( state ) {
        return main( {}, [
            h1( {}, [ state.text ] ),
            form( { onsubmit: context.send( Actions.Change ) },
                [
                    input( { name: "text" } ),
                    button( {}, [ "change" ] )
                ]
            )
        ] )
    }

    return { handlers, init, render }
}

Runtime.run( window, { create }, "app" )
