import * as Command from "./Command"
import { createFakeFetch, createWindow } from "./TestUtils"
import { WindowEnvironment, Environment } from "./Environment"

describe( "how commands interact with browser environment", function () {

    let fake_environment: Environment
    let window

    const expectAction = function ( name, data, done ) {
        window.addEventListener( "action", function ( e ) {
            expect( e.detail ).toEqual( { name, data } )
            done()
        } )
    }

    beforeEach( function () {
        window = createWindow()
        window.fetch = createFakeFetch( "/foo", { status: 200, data: {} } )
        fake_environment = new WindowEnvironment( window )
    } )

    xtest( "execute command fires action", function ( done ) {
        Command.execute( "/foo", {}, "action-name" ).executeIn( fake_environment )
        expectAction( "action-name", {}, done )
    } )

    xtest( "query command fires action with fetched data", function ( done ) {
        Command.query( "/foo", "action-name" ).executeIn( fake_environment )
        expectAction( "action-name", {}, done )
    } )

    xtest( "write data to local storage", function ( done ) {
        fake_environment.writeStorage = jest.fn()

        const data_to_write = { name: "foo" }

        Command.write( "location", data_to_write, "action-name" )
            .executeIn( fake_environment )

        expect( fake_environment.writeStorage )
            .toHaveBeenCalledWith( "location", JSON.stringify( data_to_write ) )

        expectAction( "action-name", {}, done )
    } )

    xtest( "load data from local storage", function ( done ) {
        fake_environment.readStorage = () => JSON.stringify( { name: "foo" } )

        Command.read( "some-data", "action-done" ).executeIn( fake_environment )

        expectAction( "action-done", { name: "foo" }, done )
    } )

    xtest( "redirect", function () {
        fake_environment.changeLocation = jest.fn()
        Command.redirect( "/some/path" ).executeIn( fake_environment )
        expect( fake_environment.changeLocation ).toHaveBeenCalledWith( "/some/path" )
    } )
} )