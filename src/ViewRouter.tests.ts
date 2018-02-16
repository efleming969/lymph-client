describe( "message routing", function () {

    const create = function ( routes ) {
        return function ( state ) {
            return null
        }
    }

    const view = create( {
        "app:action1": ( params ) => ( state ) => state,
        "app:action2": ( params ) => ( state ) => state,
        "app:action3:*": ( params ) => ( state ) => state,
        "app:action4": ( params ) => ( state ) => state,
        "app:*": ( params ) => ( state ) => state
    } )

    test( "handle unknown routes", function () {
        expect( view( { path: "unknown", data: "bar" } ) ).toEqual( null )
    } )

    xtest( "handle static routes", function () {
        expect( view( { name: "app:action1", data: "bar" } ) ).toEqual( "foobar" )
        expect( view( { name: "app:action2", data: "bar" } ) ).toEqual( "FOOBAR" )
    } )

    xtest( "handle wildcard routes", function () {
        expect( view( { name: "app:action3", data: "bar" } ) ).toEqual( "barfoo" )
    } )

    xtest( "forward partial message to wildcard routes", function () {
        expect( view( { name: "app:action3:sub-action1", data: "" } ) ).toEqual( "sub-action1" )
    } )

    xtest( "pass an event object", function () {
        expect( view( { name: "app:action4", data: "", event: "event-object" } ) ).toEqual( "event-object" )
    } )
} )
