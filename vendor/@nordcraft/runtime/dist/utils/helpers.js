export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
export const toSeconds = (value) => {
    if (value.endsWith('ms')) {
        return parseFloat(value) / 1000;
    }
    else {
        return parseFloat(value);
    }
};
//# sourceMappingURL=helpers.js.map