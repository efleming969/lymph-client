import { Environment } from "./Environment";
export interface Command {
    executeIn(environment: Environment): void;
}
export declare class Execute implements Command {
    private url;
    private data;
    private action;
    private token;
    constructor(url: string, data: any, action: string, token: string | undefined);
    executeIn(environment: Environment): void;
}
export declare const execute: (url: string, data: any, action: string, token?: string) => Execute;
export declare class Query implements Command {
    private url;
    private action;
    private token;
    constructor(url: string, action: string, token: string | undefined);
    executeIn(environment: Environment): void;
}
export declare const query: (url: string, action: string, token?: string) => Query;
export declare class ReadStorage implements Command {
    private location;
    private action;
    constructor(location: string, action: string);
    executeIn(environment: Environment): void;
}
export declare const read: (location: string, action: string) => ReadStorage;
export declare class WriteStorage implements Command {
    private location;
    private data;
    private action;
    constructor(location: string, data: any, action: string | undefined);
    executeIn(environment: Environment): void;
}
export declare const write: (location: string, data: any, action?: string) => WriteStorage;
export declare class Redirect implements Command {
    private path;
    constructor(path: string);
    executeIn(environment: Environment): void;
}
export declare const redirect: (path: string) => Redirect;
export declare class None implements Command {
    executeIn(environment: Environment): void;
}
export declare const none: None;
