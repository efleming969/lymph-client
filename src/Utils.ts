type Message = {
    name: string,
    data: any,
    event: any
}

export const generateId = (function () {
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const ID_LENGTH = 8

    return function () {
        let rtn = ""
        for ( let i = 0; i < ID_LENGTH; i++ ) {
            rtn += ALPHABET.charAt( Math.floor( Math.random() * ALPHABET.length ) )
        }
        return rtn
    }
})()

export const objectFromPair = function ( pair ) {
    const obj = {}
    obj[ pair[ 0 ] ] = pair[ 1 ]
    return obj
}

export const merge = function ( obj1, obj2 ) {
    return Object.assign( {}, obj1, obj2 )
}

export const dispatchAction = function ( window ) {
    return function ( event ) {
        window.dispatchEvent( new window.CustomEvent( "action",
            { detail: event, bubbles: true, cancelable: true } ) )
    }
}

export const evolve = function ( transformations, object ) {
    const result = {}

    for ( const key in object ) {
        let transformation = transformations[ key ]

        if ( typeof transformation === "function" ) {
            result[ key ] = transformation( object[ key ] )
        }
        else if ( typeof transformation === "object" ) {
            result[ key ] = evolve( transformation, object[ key ] )
        }
        else {
            result[ key ] = object[ key ]
        }
    }
    return result
}

export interface IHasEvent {
    event: Event
}

export const currentTarget = function ( message: IHasEvent ): EventTarget {
    return message.event.currentTarget
}

const forEach = function ( fn, iterable ) {
    for ( let i = 0; i < iterable.length; i++ ) {
        fn( iterable[ i ] )
    }
}

export const extractFormData = function ( form ) {
    const fields = {}

    const copyProp = function ( element, propName ) {
        fields[ element.name ] = element[ propName ]
    }

    forEach( function ( element ) {
        if ( element.type === "text" || element.type === "password" ) {
            copyProp( element, "value" )
        }
        else if ( element.type === "radio" && element.checked ) {
            copyProp( element, "value" )
        }
        else if ( element.type === "checkbox" ) {
            copyProp( element, "checked" )
        }
        else if ( element.nodeName === "SELECT" ) {
            copyProp( element, "value" )
        }
    }, form.elements )

    return fields
}

export const currentForm = function ( message: IHasEvent ): any {
    return extractFormData( currentTarget( message ) )
}

export const find = function ( array: any[], condition: ( any ) => boolean ) {
    let result

    for ( let i = 0; i < array.length; i++ ) {
        if ( condition( array[ i ] ) ) {
            return array[ i ]
        }
    }

    return result
}

export const mapObjectToArray = function ( object: any, fn: ( key: string, valiue: any ) => any ): any {
    return Object.keys( object ).map( function ( key ) {
        return fn( key, object[ key ] )
    } )
}

