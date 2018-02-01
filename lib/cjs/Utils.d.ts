export declare const generateId: () => string;
export declare const objectFromPair: (pair: any) => {};
export declare const merge: (obj1: any, obj2: any) => any;
export declare const dispatchAction: (window: any) => (event: any) => void;
export declare const sendForm: (name: any) => {
    type: string;
    name: any;
};
export declare const evolve: (transformations: any, object: any) => {};
export interface IHasEvent {
    event: Event;
}
export declare const currentTarget: (message: IHasEvent) => EventTarget;
export declare const extractFormData: (form: any) => {};
export declare const currentForm: (message: IHasEvent) => any;
export declare const find: (array: any[], condition: (any: any) => boolean) => any;
export declare const mapObjectToArray: (object: any, fn: (key: string, valiue: any) => any) => any;
export declare const createUpdater: (routeDefinitions: any) => (Message: any, any: any) => [any, any];
export declare const createContext: (names?: any[]) => {
    createComponent: (component: any, component_name: any) => {
        init: any;
        update: (Message: any, any: any) => [any, any];
        render: any;
    };
    send: (name: any) => string;
};
