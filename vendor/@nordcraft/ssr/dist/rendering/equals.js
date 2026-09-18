import fastDeepEqual from 'fast-deep-equal';
export const initIsEqual = () => {
    const toddle = {
        isEqual: fastDeepEqual,
    };
    globalThis.toddle = toddle;
};
//# sourceMappingURL=equals.js.map