import * as Command from "./Command"
import { createFakeFetch, createWindow } from "./TestUtils"

describe( "Command", function () {

    test( "execute remote command", function ( done ) {
        const command = Command.execute( "/api/post1", { name: "foobar" }, "command-done" )
        const window = createWindow()

        window.fetch = createFakeFetch( "/api/post1", { status: 200, data: {} } )

        window.addEventListener( "action", function ( e ) {
            expect( e.detail ).toEqual( { name: "command-done", data: {} } )
            done()
        } )

        Command.process( window, [ command ] )
    } )

    test( "execute remote query", function ( done ) {
        const command = Command.query( "/api/get1", "query-done" )
        const window = createWindow()

        window.fetch = createFakeFetch( "/api/get1", {
            status: 200,
            data: { name: "response-data" }
        } )

        window.addEventListener( "action", function ( e ) {
            expect( e.detail ).toEqual( {
                name: "query-done",
                data: { name: "response-data" }
            } )
            done()
        } )

        Command.process( window, [ command ] )
    } )

    test( "save data to local storage", function ( done ) {
        const command = Command.save( "some-data", { name: "some-data" }, "save-done" )
        const window = createWindow()

        window.localStorage = { setItem: jest.fn() }

        window.addEventListener( "action", function ( e ) {
            expect( window.localStorage.setItem )
                .toHaveBeenCalledWith( "some-data", JSON.stringify( { name: "some-data" } ) )
            done()
        } )

        Command.process( window, [ command ] )
    } )

    test( "load data from local storage", function ( done ) {
        const command = Command.load( "some-data", "load-done" )
        const window = createWindow()

        window.localStorage = { getItem: () => JSON.stringify( { name: "some-data" } ) }

        window.addEventListener( "action", function ( e ) {
            expect( e.detail ).toEqual( {
                name: "load-done",
                data: { name: "some-data" }
            } )
            done()
        } )

        Command.process( window, [ command ] )
    } )

    test( "redirect", function () {
        const window = { location: { assign: jest.fn() } }

        Command.process( window, [ Command.redirect( "/some/path" ) ] )

        expect( window.location.assign ).toHaveBeenCalledWith( "/some/path" )
    } )
} )