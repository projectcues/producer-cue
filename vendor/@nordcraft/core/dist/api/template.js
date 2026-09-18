export const STRING_TEMPLATE = (type, name) => {
    return `{{ ${templateTypes[type]}.${name} }}`;
};
const templateTypes = {
    cookies: 'cookies',
};
//# sourceMappingURL=template.js.map