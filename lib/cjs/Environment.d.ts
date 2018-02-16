export interface Environment {
    fetch(path: string, options: any): Promise<any>;
    changeLocation(path: string): void;
    writeStorage(location: string, data: any): void;
    readStorage(location: string): any;
    dispatch(action_name: string, data: any): void;
}
export declare class WindowEnvironment implements Environment {
    private window;
    constructor(window: any);
    fetch(path: string, options: any): Promise<any>;
    changeLocation(path: string): void;
    writeStorage(location: string, data: string): void;
    readStorage(location: string): string;
    dispatch(action_name: string, data: any): void;
}
