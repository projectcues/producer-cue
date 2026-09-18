export declare const isLocalhostUrl: (hrefOrOrigin: string) => boolean;
export declare const isLocalhostHostname: (hostname: string) => hostname is "127.0.0.1" | "localhost";
export declare const validateUrl: ({ path, origin, }: {
    path: string | null | undefined;
    origin: string | undefined;
}) => false | URL;
export declare const PROXY_URL_HEADER = "x-nordcraft-url";
export declare const PROXY_TEMPLATES_IN_BODY = "x-nordcraft-templates-in-body";
export declare const REWRITE_HEADER = "x-nordcraft-rewrite";
