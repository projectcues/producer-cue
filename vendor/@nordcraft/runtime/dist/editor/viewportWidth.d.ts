/**
 * Resolves once `window.innerWidth` matches `width`, or rejects if it hasn't
 * happened within `timeoutMs`. Resizing our own iframe element has to happen
 * on the editor side (same-origin policy prevents us from doing it directly),
 * so this observes the native `resize` event fired once the editor applies it
 * rather than requiring an explicit reply message from the editor.
 */
export declare const waitForViewportWidth: (width: number, timeoutMs?: number) => Promise<void>;
