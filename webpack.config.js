const Path = require( "path" )

const source_path = Path.resolve( "./lib" )

module.exports = {
    entry: Path.join( source_path, "LymphClient.js" ),

    mode: "production",

    output: {
        path: Path.resolve( __dirname, 'dist' ),
        filename: 'lymph-client.js',
        library: "LymphClient",
        libraryTarget: "var"
    }
}
