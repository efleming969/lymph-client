import HTTP from "./HTTP"

export interface Environment {
    fetch ( path: string, options: any ): Promise<any>

    changeLocation( path: string ): void

    writeStorage( location: string, data: any ): void

    readStorage( location: string ): any

    dispatch( action_name: string, data: any ): void
}

export class WindowEnvironment implements Environment {
    constructor ( private window ) {
    }

    fetch ( path: string, options: any ): Promise<any> {
        return this.window.fetch( path, options )
    }

    changeLocation ( path: string ): void {
        this.window.location.assign( path )
    }

    writeStorage ( location: string, data: string ): void {
        this.window.localStorage.setItem( location, data )
    }

    readStorage ( location: string ): string {
        return this.window.localStorage.getItem( location )
    }

    dispatch ( action_name: string, data: any ): void {
        const action_event = new this.window.CustomEvent( "action", {
            detail: { name: action_name, data },
            bubbles: true,
            cancelable: true
        } )

        this.window.dispatchEvent( action_event )
    }
}
