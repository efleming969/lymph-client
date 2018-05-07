import { Runtime, Command } from "../src/LymphClient"
import { h1, main, form, input, button, h2 } from "../src/HTML"
import * as Utils from "../src/Utils"
import * as Router from "../src/Router"

type State = {
    message: string,
    invalid: boolean,
    text: string,
    location: string
}

const Events = {
    Submitted: "submitted",
    Changed: "form-changed",
    Added: "post-added"
}

const handlers = {
    [ Events.Submitted ]: function ( message, state: State ) {
        return [
            Utils.merge( state, { text: "" } ),
            Command.execute( "https://jsonplaceholder.typicode.com/posts", {
                title: state.text,
                body: "some text to go with the body",
                userId: 200
            }, Events.Added )
        ]
    },

    [ Router.Events.Changed ]: function ( message, state: State ) {
        return [
            Utils.merge( state, { location: message.data } ),
            Command.none
        ]
    },

    [ Events.Changed ]: function ( message, state: State ) {
        const form_data = Utils.currentForm( message )
        const invalid = form_data.text.length == 0

        return [ Utils.merge( state, { invalid, text: form_data.text } ), Command.none ]
    },

    [ Events.Added ]: function ( message, state: State ) {
        return [
            Utils.merge( state, { message: "done posting" } ),
            Command.none
        ]
    }
}

const init = ( location ): [ State, Command.Command ] => [
    { location, message: "hello, world", text: "", invalid: true },
    Command.none
]

const renderWelcome = ( name ) => h2( {}, [ name ] )

const render = ( state: State ) => main( {}, [
    h1( {}, [ state.message ] ),
    form( { onsubmit: [ Events.Submitted ], oninput: [ Events.Changed ] }, [
        input( { name: "text", autocomplete: "off" } ),
        button( { disabled: state.invalid }, [ "Submit" ] )
    ] ),
    Router.match( state.location, {
        "/welcome/:name": ( params ) => renderWelcome( params.name ),
        "/foobar": () => renderWelcome( "world!" ),
        "*": () => renderWelcome( "dog!" )
    } )
] )

Runtime.run( window, { handlers, init, render } )
