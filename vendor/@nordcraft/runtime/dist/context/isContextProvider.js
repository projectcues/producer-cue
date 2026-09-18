export const isContextProvider = (component) => (component.formulas &&
    Object.values(component.formulas).some((f) => f?.exposeInContext)) ||
    (component.workflows &&
        Object.values(component.workflows).some((w) => w?.exposeInContext));
//# sourceMappingURL=isContextProvider.js.map