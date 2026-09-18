export const applyPathFormula = (formula, data) => {
    let input = data;
    for (const key of formula.path) {
        if (input && typeof input === 'object') {
            input = input[key];
        }
        else {
            return null;
        }
    }
    return input;
};
//# sourceMappingURL=pathFormula.js.map