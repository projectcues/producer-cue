export function tryStartViewTransition(updateCallback, options) {
    const startViewTransition = document
        .startViewTransition;
    if (!startViewTransition ||
        (options?.skipPrefersReducedMotionCheck !== true &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        updateCallback();
        return {
            finished: Promise.resolve(),
        };
    }
    return startViewTransition.call(document, updateCallback);
}
//# sourceMappingURL=tryStartViewTransition.js.map