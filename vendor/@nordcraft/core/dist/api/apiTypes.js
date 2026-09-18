export var ApiMethod;
(function (ApiMethod) {
    ApiMethod["GET"] = "GET";
    ApiMethod["POST"] = "POST";
    ApiMethod["DELETE"] = "DELETE";
    ApiMethod["PUT"] = "PUT";
    ApiMethod["PATCH"] = "PATCH";
    ApiMethod["HEAD"] = "HEAD";
    ApiMethod["OPTIONS"] = "OPTIONS";
})(ApiMethod || (ApiMethod = {}));
export const REDIRECT_STATUS_CODES = [
    300, 301, 302, 303, 304, 307, 308,
];
//# sourceMappingURL=apiTypes.js.map