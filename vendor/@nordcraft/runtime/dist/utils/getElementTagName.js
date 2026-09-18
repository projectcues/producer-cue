export function getElementTagName(node, ctx, id) {
    if (ctx.component.version === 2 && id === 'root') {
        return `${ctx.package ?? ctx.toddle.project}-${node.tag}`;
    }
    return node.tag;
}
//# sourceMappingURL=getElementTagName.js.map