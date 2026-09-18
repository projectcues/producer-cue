/**
 * Omit the `cookie` header from a set of headers.
 * This is useful when proxying requests for routes/proxied API requests
 * to ensure cookies are not forwarded.
 */
export declare const skipCookieHeader: (headers: Headers) => Headers;
export declare const REDIRECT_API_NAME_HEADER = "x-nordcraft-redirect-api-name";
export declare const REDIRECT_COMPONENT_NAME_HEADER = "x-nordcraft-redirect-component-name";
export declare const REDIRECT_NAME_HEADER = "x-nordcraft-redirect-name";
/**
 * Omit the "x-nordcraft-url" and "x-nordcraft-templates-in-body" headers
 * from a set of headers. Since these headers are only relevant for the
 * Nordcraft API proxy, it's not useful for other services to receive them
 */
export declare const skipNordcraftHeaders: (headers: Headers) => Headers;
export declare const skipHopByHopHeaders: (headers: Headers) => Headers;
export declare const skipContentEncodingHeader: (headers: Headers) => Headers;
