export declare function tryStartViewTransition(updateCallback: () => void, options?: {
    skipPrefersReducedMotionCheck?: boolean;
}): {
    finished: Promise<void>;
};
