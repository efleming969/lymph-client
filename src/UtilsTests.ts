import { createContext, merge } from "./Utils"

describe( "context", function () {

    test( "create a component with root name", function () {
        const root_context = createContext()

        const component = {
            create: function ( context ) {
                return context.send( "name" )
            }
        }

        const result = root_context.createComponent( component, "app" )

        expect( result ).toEqual( ":name" )
    } )

    test( "create a component with root and sub component", function () {
        const root_context = createContext()

        const component1 = {
            create: function ( context ) {
                return context.send( "name" )
            }
        }

        const component2 = {
            create: function ( context ) {
                return context.createComponent( component1, "sub" )
            }
        }

        const result = root_context.createComponent( component2, "app" )

        expect( result ).toEqual( ":sub:name" )
    } )
} )

