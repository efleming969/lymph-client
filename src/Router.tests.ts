import * as Router from "./Router"

describe( "router", function() {

    test( "match a static route", function() {
        const result = Router.match( "/parent/child", {
            "/parent/child": () => "found"
        } )

        expect( result ).toEqual( "found" )
    } )

    test( "match route with param", function() {
        const result = Router.match( "/parent/child", {
            "/parent/:name": ( params ) => "found " + params.name
        } )

        expect( result ).toEqual( "found child" )
    } )

    test( "match route with 2 params", function() {
        const result = Router.match( "/parent/child/grandchild", {
            "/parent/:name/:id": ( p ) => `found ${ p.name } & ${ p.id }`
        } )

        expect( result ).toEqual( "found child & grandchild" )
    } )

    test( "match default route", function() {
        const result = Router.match( "/parent/unknown", {
            "/parent/child": () => "should not find this",
            "*": () => "found"
        } )

        expect( result ).toEqual( "found" )
    } )
} )
