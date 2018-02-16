export interface Environment {
    post(path: string, data: any, auth_token?: string): Promise<any>;
    get(path: string, auth_token?: string): Promise<any>;
    changeLocation(path: string): void;
    writeStorage(location: string, data: any): void;
    readStorage(location: string): any;
    dispatch(action_name: string, data: any): void;
}
export declare class WindowEnvironment implements Environment {
    private window;
    private http;
    constructor(window: any);
    post(path: string, data: any, auth_token?: string): Promise<any>;
    get(path: string, auth_token?: string): Promise<any>;
    changeLocation(path: string): void;
    writeStorage(location: string, data: string): void;
    readStorage(location: string): string;
    dispatch(action_name: string, data: any): void;
}
