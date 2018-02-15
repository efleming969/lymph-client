import HTTP from "./HTTP"
import { createFakeFetch } from "./TestUtils"

describe( "posting data to json endpoint", function () {

    test( "200 response returns de-serialized data", function () {
        const http = new HTTP(
            createFakeFetch( "/foobar", { status: 200, data: { name: "foo" } } ) )

        return http.execute( "/foobar", {} ).then( function ( response_data ) {
            expect( response_data ).toEqual( { name: "foo" } )
        } )
    } )

    test( "posted data is serialized", function () {
        const fakeFetch = createFakeFetch( "/foo", {} )
        const http = new HTTP( fakeFetch )

        return http.execute( "/foo", { text: "foobar" } ).then( function ( response ) {
            expect( fakeFetch.mock.calls[ 0 ][ 1 ].body )
                .toEqual( JSON.stringify( { text: "foobar" } ) )
        } )
    } )

    test( "authentication token is passed, when given", function () {
        const fakeFetch = createFakeFetch( "/foo", {} )
        const http = new HTTP( fakeFetch )

        return http.execute( "/foo", {}, "jwt" ).then( function ( response ) {
            expect( fakeFetch.mock.calls[ 0 ][ 1 ].headers[ "Authorization" ] )
                .toEqual( "jwt" )
        } )
    } )

    test( "no authentication token is passed, when not given", function () {
        const fakeFetch = createFakeFetch( "/foo", {} )
        const http = new HTTP( fakeFetch )

        return http.execute( "/foo", {} ).then( function ( response ) {
            expect( fakeFetch.mock.calls[ 0 ][ 1 ].headers[ "Authorization" ] )
                .toBeUndefined()
        } )
    } )

    test( "bad request are handled", function () {
        const fakeFetch = createFakeFetch( "/foo", {
            status: 400,
            data: "error_message"
        } )

        const http = new HTTP( fakeFetch )

        return http.execute( "/foo", {} ).then( function ( response ) {
            throw Error( "did not handle bad request" )
        }, function ( error ) {
            expect( error ).toEqual( "error_message" )
        } )
    } )
} )

describe( "querying data from a json endpoint", function () {

    test( "query response data is returned", function () {
        const http = new HTTP(
            createFakeFetch( "/foobar", { status: 200, data: { name: "foo" } } ) )

        return http.query( "/foobar" ).then( function ( response ) {
            expect( response ).toEqual( { name: "foo" } )
        } )
    } )

    test( "authentication token is passed, when given", function () {
        const fakeFetch = createFakeFetch( "/foo", {} )
        const http = new HTTP( fakeFetch )

        return http.query( "/foo", "jwt" ).then( function ( response ) {
            expect( fakeFetch.mock.calls[ 0 ][ 1 ].headers[ "Authorization" ] )
                .toEqual( "jwt" )
        } )
    } )

    test( "no authentication token is passed, when not given", function () {
        const fakeFetch = createFakeFetch( "/foo", {} )
        const http = new HTTP( fakeFetch )

        return http.query( "/foo" ).then( function ( response ) {
            expect( fakeFetch.mock.calls[ 0 ][ 1 ].headers[ "Authorization" ] )
                .toBeUndefined()
        } )
    } )

    test( "bad request are handled", function () {
        const fakeFetch = createFakeFetch( "/foo", {
            status: 400,
            data: "error_message"
        } )

        const http = new HTTP( fakeFetch )

        return http.query( "/foo" ).then( function ( response ) {
            throw Error( "did not handle bad request" )
        }, function ( error ) {
            expect( error ).toEqual( "error_message" )
        } )
    } )
} )
