declare module "json-to-ts" {
    interface Options {
        rootName?: string;
        useTypeAlias?: boolean;
    }

    function JsonToTS(json: any, options?: Options): string[];

    export default JsonToTS;
}
