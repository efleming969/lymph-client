import * as HTTP from "./HTTP"
import { createFakeFetch } from "./TestUtils"

test( "successful post and command", function () {
    const send = HTTP.sendCommand( createFakeFetch( { status: 200, data: { name: "foo" } } ) )

    return send( "/api/post1", {}, "jwt" ).then( function ( response ) {
        expect( response ).toEqual( { status: 200, data: { name: "foo" } } )
    } )

} )

test( "successful post, but server rejected command", function () {
    const send = HTTP.sendCommand( createFakeFetch( { status: 400, data: { message: "bar" } } ) )

    return send( "/api/post1", {}, "jwt" ).then( function ( response ) {
        expect( response ).toEqual( { status: 400, data: { message: "bar" } } )
    } )
} )

test( "successful get with returned data", function () {
    const send = HTTP.sendQuery( createFakeFetch( { status: 200, data: { name: "foo" } } ) )

    return send( "/api/get1", "jwt" ).then( function ( response ) {
        expect( response ).toEqual( { status: 200, data: { name: "foo" } } )
    } )
} )