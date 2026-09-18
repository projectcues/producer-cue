import type { FormulaContext } from '@nordcraft/core/dist/formula/formula';
export declare const getHtmlLanguage: ({ pageInfo, formulaContext, defaultLanguage, }: {
    pageInfo?: import("@nordcraft/core/dist/types").Nullable<{
        language?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        theme?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        title?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        description?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        icon?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        charset?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        meta?: import("@nordcraft/core/dist/types").Nullable<Record<string, import("@nordcraft/core/dist/component/component.types").MetaEntry>>;
    }>;
    formulaContext: FormulaContext;
    defaultLanguage?: string | undefined;
}) => string;
export declare const getCharset: ({ pageInfo, formulaContext, defaultCharset, }: {
    pageInfo?: import("@nordcraft/core/dist/types").Nullable<{
        language?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        theme?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        title?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        description?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        icon?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        charset?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        meta?: import("@nordcraft/core/dist/types").Nullable<Record<string, import("@nordcraft/core/dist/component/component.types").MetaEntry>>;
    }>;
    formulaContext: FormulaContext;
    defaultCharset?: string | undefined;
}) => string;
export declare const getTheme: ({ pageInfo, formulaContext, }: {
    pageInfo?: import("@nordcraft/core/dist/types").Nullable<{
        language?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        theme?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        title?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        description?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        icon?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        charset?: import("@nordcraft/core/dist/types").Nullable<{
            formula: import("@nordcraft/core/dist/formula/formula").Formula;
        }>;
        meta?: import("@nordcraft/core/dist/types").Nullable<Record<string, import("@nordcraft/core/dist/component/component.types").MetaEntry>>;
    }>;
    formulaContext: FormulaContext;
}) => string | null;
