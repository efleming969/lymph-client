export declare const createTarget: (html: any) => any;
export declare const createWindow: () => any;
export declare const createTestContext: () => {
    onAction: (callback: any) => void;
    dispatch: (event_type: any, selector: any) => void;
    render: (view: any) => void;
    find: (selector: any) => any;
};
export declare const createFakeFetch: (response: any) => (url: any, options: any) => Promise<{}>;