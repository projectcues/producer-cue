import { toBoolean } from '@nordcraft/core/dist/utils/util';
const handler = ([elem, preventScroll]) => {
    if (elem instanceof HTMLElement) {
        elem.focus({
            preventScroll: toBoolean(preventScroll),
        });
    }
};
export default handler;
//# sourceMappingURL=handler.js.map