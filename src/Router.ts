export const Events = {
    Changed: "route-changed"
}

export const match = function ( pathname, routes ) {
    let match
    let index
    const params = {}
    const routeKeys = Object.keys( routes )

    for ( let i = 0; i < routeKeys.length && !match; i++ ) {
        const route = routeKeys[ i ]
        const keys = []
        pathname.replace(
            RegExp(
                route === "*"
                    ? ".*"
                    : "^" +
                    route.replace( /\//g, "\\/" ).replace( /:([\w]+)/g, function ( _, key ) {
                        keys.push( key )
                        return "([-\\.%\\w\\(\\)]+)"
                    } ) +
                    "/?$",
                "g"
            ),
            function () {
                for ( let j = 1; j < arguments.length - 2; ) {
                    let value = arguments[ j++ ]
                    try {
                        value = decodeURI( value )
                    } catch ( _ ) {
                    }
                    params[ keys.shift() ] = value
                }
                match = route
                index = i
            }
        )
    }

    return routes[ match ]( params )
}

