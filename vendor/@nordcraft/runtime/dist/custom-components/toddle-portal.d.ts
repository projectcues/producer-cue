declare class Portal extends HTMLElement {
    root: HTMLElement;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
}
