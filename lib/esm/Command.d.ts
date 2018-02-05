export declare const process: (window: any, command: any) => void;
export declare const execute: (url: any, data: any, action: any, token?: any) => {
    type: string;
    url: any;
    data: any;
    action: any;
    token: any;
};
export declare const query: (url: any, action: any, token?: any) => {
    type: string;
    url: any;
    action: any;
    token: any;
};
export declare const redirect: (path: any) => {
    type: string;
    path: any;
};
export declare const load: (location: any, action: any) => {
    type: string;
    location: any;
    action: any;
};
export declare const save: (location: any, data: any, action?: any) => {
    type: string;
    location: any;
    data: any;
    action: any;
};
