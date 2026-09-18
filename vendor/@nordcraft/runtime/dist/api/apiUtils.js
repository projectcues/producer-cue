export const isContextApiV2 = (api) => 'triggerActions' in api;
export class ApiAbortHandler {
    abortControllers = [];
    applyAbortSignal = (requestInit) => {
        const abortController = new AbortController();
        this.abortControllers.push(abortController);
        this.cleanupAbortedControllers();
        return {
            ...requestInit,
            signal: requestInit.signal
                ? AbortSignal.any([requestInit.signal, abortController.signal])
                : abortController.signal,
        };
    };
    abort = () => {
        this.abortControllers.forEach((controller) => {
            controller.abort();
        });
        this.abortControllers = [];
    };
    cleanupAbortedControllers = () => {
        this.abortControllers = this.abortControllers.filter((controller) => !controller.signal.aborted);
    };
}
//# sourceMappingURL=apiUtils.js.map