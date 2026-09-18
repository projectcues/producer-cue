export function getDragData(event) {
    if (event instanceof DragEvent) {
        return Array.from(event.dataTransfer?.items ?? []).reduce((dragData, item) => {
            dragData[item.type] = event.dataTransfer?.getData(item.type);
            return dragData;
        }, {});
    }
    return;
}
//# sourceMappingURL=getDragData.js.map