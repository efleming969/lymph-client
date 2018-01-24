import { merge } from "./Utils"

type Message = {
    name: string,
    data: any,
    event: any
}

const extractMessage = function ( parent_message, message ) {
    return merge( message, { name: message.name.replace( ":" + parent_message, "" ) } )
}

export const create = function ( routeDefinitions: any ): ( Message, any ) => [ any, any ] {
    return function ( message: Message, state: any ): [ any, any ] {
        for ( let name in routeDefinitions ) {
            if ( message.name.indexOf( ":" + name ) === 0 ) {
                return routeDefinitions[ name ]( extractMessage( name, message ), state )
            }
        }

        return [ state, undefined ]
    }
}
