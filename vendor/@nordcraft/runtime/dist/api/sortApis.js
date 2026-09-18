export const sortApis = (apis) => {
    return [...apis].sort(([_, aObj], [__, bObj]) => {
        return compareApiDependencies(aObj, bObj);
    });
};
const compareApiDependencies = (a, b) => {
    const isADependentOnB = a.dependsOn?.includes(b.name) ?? false;
    const isBDependentOnA = b.dependsOn?.includes(a.name) ?? false;
    if (isADependentOnB === isBDependentOnA) {
        return 0;
    }
    // 1 means A goes last - hence B is evaluated before A
    return isADependentOnB ? 1 : -1;
};
//# sourceMappingURL=sortApis.js.map