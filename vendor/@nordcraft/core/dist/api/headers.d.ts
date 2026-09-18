import type { Nullable } from '../types';
/**
 * Checks if a header is a json (content-type) header
 * Also supports edge cases like application/vnd.api+json and application/vnd.contentful.delivery.v1+json
 * See https://jsonapi.org/#mime-types
 */
export declare const isJsonHeader: (header?: Nullable<string>) => boolean;
export declare const isTextHeader: (header?: Nullable<string>) => boolean;
export declare const isEventStreamHeader: (header?: Nullable<string>) => boolean;
export declare const isJsonStreamHeader: (header?: Nullable<string>) => boolean;
export declare const isImageHeader: (header?: Nullable<string>) => boolean;
/**
 * Returns an object with headers from a Headers object
 * Duplicate header values (set-cookie for instance) are encoded as a comma-separated string
 */
export declare const mapHeadersToObject: (headers: Headers) => Record<string, string>;
