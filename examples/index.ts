import { Utils, Runtime, Command } from "../src/LymphClient"
import { h1, main, form, input, button } from "../src/HTML"
import { currentForm } from "../src/Utils"

const Events = {
    Submitted: "submitted"
}

const handlers = {
    [ Events.Submitted ]: function ( message, state ) {
        return [
            Utils.merge( state, { text: currentForm( message ).text } ),
            Command.none
        ]
    }
}

const init = () => [
    { text: "world" },
    Command.none
]

const render = ( state ) => main( {}, [
    h1( {}, [ `hello, ${ state.text }!` ] ),
    form( { onsubmit: [ Events.Submitted ] },
        [
            input( { name: "text", autocomplete: "off" } ),
            button( {}, [ "Submit" ] )
        ]
    )
] )

Runtime.run( window, { handlers, init, render } )
