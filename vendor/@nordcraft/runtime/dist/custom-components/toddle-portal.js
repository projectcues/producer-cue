"use strict";
class Portal extends HTMLElement {
    root;
    constructor() {
        // Always call super first in constructor
        super();
        this.root = document.createElement('div');
    }
    connectedCallback() {
        for (const child of Array.from(this.children)) {
            this.root.appendChild(child);
        }
        document.body.appendChild(this.root);
    }
    disconnectedCallback() {
        this.root?.remove();
    }
}
customElements.define('toddle-portal', Portal);
//# sourceMappingURL=toddle-portal.js.map