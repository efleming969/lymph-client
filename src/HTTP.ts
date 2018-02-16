import { merge } from "./Utils"

const fetchHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const createFetchOptions = function ( method: string, token: string, data: any ) {
    const headers = merge( fetchHeaders, token ? { "Authorization": token } : {} )
    const body = data ? JSON.stringify( data ) : null

    return { method, headers, body }
}

export default class {
    constructor ( private fetch ) {
    }

    post ( path: string, data: any, auth_token?: string ) {
        const options = createFetchOptions( "POST", auth_token, data )

        return this.fetch( path, options ).then( function ( response ) {
            return response.json().then( function ( data ) {
                if ( response.status === 400 ) throw data
                return data
            } )
        } )
    }

    get ( path: string, auth_token?: string ) {
        const options = createFetchOptions( "GET", auth_token, null )

        return this.fetch( path, options ).then( function ( response ) {
            return response.json().then( function ( data ) {
                if ( response.status === 400 ) throw data
                return data
            } )
        } )
    }
}
