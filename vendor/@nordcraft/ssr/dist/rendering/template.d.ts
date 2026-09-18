export declare const applyTemplateValues: (input: string | null | undefined, cookies: Partial<Record<string, string>>) => string;
export declare const sanitizeProxyHeaders: ({ cookies, headers, }: {
    cookies: Record<string, string>;
    headers: Headers;
}) => Headers;
export declare const mapTemplateHeaders: ({ cookies, headers, }: {
    cookies: Record<string, string>;
    headers: Headers;
}) => Headers;
