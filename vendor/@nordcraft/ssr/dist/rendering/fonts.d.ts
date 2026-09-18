import type { FontFamily } from '@nordcraft/core/dist/styling/theme';
export declare const getFontCssUrl: ({ fonts, baseForAbsoluteUrls, basePath, }: {
    fonts: FontFamily[];
    baseForAbsoluteUrls?: string | undefined;
    basePath?: string | undefined;
}) => Record<"swap", string> | undefined;
