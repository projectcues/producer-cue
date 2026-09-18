export function initLogState() {
    ;
    window.logState = () => {
        // eslint-disable-next-line no-console
        console.table(Object.entries(window.__components ?? {}).map(([name, sig]) => {
            return {
                name,
                ...sig.get(),
            };
        }));
    };
}
export function registerComponentToLogState(component, dataSignal) {
    if (!window.__components) {
        window.__components = {};
    }
    window.__components[component.name] = dataSignal;
}
//# sourceMappingURL=logState.js.map