export declare const createFetchOptions: (method: string, token: string, data: any) => {
    method: string;
    headers: any;
    body: string;
};
export default class  {
    private fetch;
    constructor(fetch: any);
    post(path: string, data: any, auth_token?: string): any;
    get(path: string, auth_token?: string): any;
}
