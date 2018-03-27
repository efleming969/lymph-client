import { Environment } from "./Environment"
import { createFetchOptions } from "./HTTP"

export interface Command {
    executeIn ( environment: Environment ): void
}

export class Execute implements Command {
    constructor ( private url: string,
                  private data: any,
                  private action: string,
                  private token: string | undefined ) {
    }

    executeIn ( environment: Environment ): void {
        const fetch_options = createFetchOptions( "POST", this.token, this.data )
        const action_name = this.action

        environment.fetch( this.url, fetch_options ).then( function ( response ) {
            return response.json().then( function ( response_data ) {
                if ( response.status === 400 ) throw response_data
                environment.dispatch( action_name, response_data )
            } )
        } )
    }
}

export const execute = function ( url: string, data: any, action: string, token?: string ) {
    return new Execute( url, data, action, token )
}

export class Query implements Command {
    constructor ( private url: string,
                  private action: string,
                  private token: string | undefined ) {
    }

    executeIn ( environment: Environment ): void {
        const fetch_options = createFetchOptions( "GET", this.token, null )
        const action_name = this.action

        environment.fetch( this.url, fetch_options ).then( function ( response ) {
            return response.json().then( function ( response_data ) {
                if ( response.status === 400 ) throw response_data
                environment.dispatch( action_name, response_data )
            } )
        } )
    }
}

export const query = function ( url: string, action: string, token?: string ) {
    return new Query( url, action, token )
}

export class ReadStorage implements Command {
    constructor ( private location: string,
                  private action: string ) {
    }

    executeIn ( environment: Environment ): void {
        const data = JSON.parse( environment.readStorage( this.location ) )
        environment.dispatch( this.action, data )
    }
}

export const read = function ( location: string, action: string ) {
    return new ReadStorage( location, action )
}

export class WriteStorage implements Command {
    constructor ( private location: string,
                  private data: any,
                  private action: string | undefined ) {
    }

    executeIn ( environment: Environment ): void {
        environment.writeStorage( this.location, JSON.stringify( this.data ) )
        if ( this.action ) environment.dispatch( this.action, this.data )
    }
}

export const write = function ( location: string, data: any, action?: string ) {
    return new WriteStorage( location, data, action )
}

export class Redirect implements Command {
    constructor ( private path: string ) {
    }

    executeIn ( environment: Environment ) {
        environment.changeLocation( this.path )
    }
}

export const redirect = function ( path: string ): Redirect {
    return new Redirect( path )
}

export class None implements Command {
    executeIn ( environment: Environment ): void {
    }
}

export const none = new None()

