export const sendCommand = function ( fetch ) {
    return function ( path, data, auth_token ) {
        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth_token,
                "Accept": "application/json"
            },
            body: JSON.stringify( data )
        }

        return fetch( path, options ).then( function ( response ) {
            return response.json().then( function ( data ) {
                return { data, status: response.status }
            } )
        } )
    }
}

export const sendQuery = function ( fetch ) {
    return function ( path, auth_token ) {
        const options = {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth_token,
                "Accept": "application/json"
            }
        }

        return fetch( path, options ).then( function ( response ) {
            return response.json().then( function ( data ) {
                return { data, status: response.status }
            } )
        } )
    }
}
