import * as Utils from "./Utils"
import * as MessageRouter from "./MessageRouter"

describe( "message routing", function () {

    const actions = {
        Action1: "action1",
        Action2: "action2",
        Action3: "action3",
        Action4: "action4"
    }

    const sub_actions = {
        Action1: "action1",
        Action2: "action2"
    }

    const sub_routes = MessageRouter.create( {
        [ sub_actions.Action1 ]: ( message, state ) => [ "sub_action1" ],
        [ sub_actions.Action2 ]: ( message, state ) => [ "sub_action2" + state ]
    } )

    const routes = MessageRouter.create( {
        [ actions.Action1 ]: ( message, state ) => [ state + message.data ],
        [ actions.Action2 ]: ( message, state ) => [ (state + message.data).toUpperCase() ],
        [ actions.Action3 ]: ( message, state ) => sub_routes( message, state ),
        [ actions.Action4 ]: ( message, state ) => [ message.event ]
    } )

    test( "unknown routes just returns the state", function () {
        expect( routes( { name: "unknown", data: "bar" }, "foo" ) ).toEqual( [ "foo", undefined ] )
    } )

    test( "handle static routes", function () {
        expect( routes( { name: ":action1", data: "bar" }, "foo" ) ).toEqual( [ "foobar" ] )
        expect( routes( { name: ":action2", data: "bar" }, "foo" ) ).toEqual( [ "FOOBAR" ] )
    } )

    test( "handle child routes", function () {
        expect( routes( { name: ":action3:action1", data: "" }, "" ) ).toEqual( [ "sub_action1" ] )
    } )

    test( "send state to child routes", function () {
        expect( routes( { name: ":action3:action2", data: "" }, "foo" ) ).toEqual( [ "sub_action2foo" ] )
    } )

    test( "pass an event object", function () {
        expect( routes( { name: ":action4", data: "", event: "event-object" }, "" ) ).toEqual( [ "event-object" ] )
    } )

} )

describe( "utils", function () {

    it( 'maps an object to an array of things', function () {
        const result = Utils.mapObjectToArray( { "some-name": () => "some function" }, function ( key, value ) {
            return { name: key, fn: value }
        } )

        expect( result[ 0 ].fn() ).toEqual( "some function" )
    } );
} )
