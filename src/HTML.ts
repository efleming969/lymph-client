const convertProperties = function ( propsIn ) {
    const propsOut: any = {}

    for ( let propName in propsIn ) {
        if ( propName === "classes" ) {
            let classes = []
            for ( let className in propsIn.classes ) {
                if ( propsIn.classes[ className ] ) {
                    classes.push( className )
                }
            }
            propsOut.className = classes.join( " " )
        }
        else {
            propsOut[ propName ] = propsIn[ propName ]
        }
    }

    return propsOut
}

const convertChildren = function ( children ) {
    if ( typeof children === "string" ) {
        return [ children ]
    }
    else {
        return children
    }
}

export interface Element {
    tagName: string,
    properties: any,
    children: Element[]
}

const create = function ( tagName ) {
    tagName = tagName.toUpperCase()
    return function ( properties = {}, children = [] ): Element {
        return {
            tagName,
            properties: convertProperties( properties ),
            children: convertChildren( children )
        }
    }
}

export const h1 = create( "h1" )
export const h2 = create( "h2" )
export const h3 = create( "h3" )

export const hr = create( "hr" )
export const a = create( "a" )

export const p = create( "p" )
export const div = create( "div" )
export const span = create( "span" )

export const ul = create( "ul" )
export const li = create( "li" )

export const form = create( "form" )
export const input = create( "input" )
export const button = create( "button" )
export const select = create( "select" )
export const label = create( "label" )
export const fieldset = create( "fieldset" )

export const body = create( "body" )
export const section = create( "section" )
export const header = create( "header" )
export const footer = create( "footer" )
export const main = create( "main" )
export const canvas = create( "canvas" )

export const textBox = ( name: string, value: string ) =>
    input( { type: "text", name: name, value: value } )

export const link = ( href: string, text: string ) =>
    a( { href }, [ text ] )

export const buildFormField = function ( field ) {
    return div( {}, [
        label( { for: field.id }, [ field.label ] ),
        input( { type: field.type, id: field.id, name: field.id, value: field.value || "" } )
    ] )
}

