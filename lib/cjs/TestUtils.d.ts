/// <reference types="jest" />
import * as JSDOM from "jsdom";
export declare const createTarget: (html: any) => Node;
export declare const createWindow: () => JSDOM.DOMWindow;
export declare const createTestContext: () => {
    onAction: (callback: any) => void;
    dispatch: (event_type: any, selector: any) => void;
    render: (view: any) => void;
    find: (selector: any) => any;
};
export declare const createFakeFetch: (path: any, response: any) => jest.Mock<Promise<{}>>;
