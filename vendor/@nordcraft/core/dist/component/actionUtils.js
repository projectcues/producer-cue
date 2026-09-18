import { isDefined } from '../utils/util.js';
export function* getActionsInAction(action, path = []) {
    if (!isDefined(action)) {
        return;
    }
    yield [path, action];
    switch (action.type) {
        case 'AbortFetch':
        case 'SetURLParameter':
        case 'SetURLParameters':
        case 'SetVariable':
        case 'TriggerEvent':
        case 'TriggerWorkflowCallback':
            break;
        case 'TriggerWorkflow':
            for (const [key, callback] of Object.entries(action.callbacks ?? {})) {
                if (callback) {
                    for (const [aKey, a] of Object.entries(callback.actions ?? {})) {
                        if (a) {
                            yield* getActionsInAction(a, [
                                ...path,
                                'callbacks',
                                key,
                                'actions',
                                aKey,
                            ]);
                        }
                    }
                }
            }
            break;
        case 'Fetch':
            for (const [key, a] of Object.entries(action.onSuccess?.actions ?? {})) {
                yield* getActionsInAction(a, [...path, 'onSuccess', 'actions', key]);
            }
            for (const [key, a] of Object.entries(action.onError?.actions ?? {})) {
                yield* getActionsInAction(a, [...path, 'onError', 'actions', key]);
            }
            for (const [key, a] of Object.entries(action.onMessage?.actions ?? {})) {
                yield* getActionsInAction(a, [...path, 'onMessage', 'actions', key]);
            }
            break;
        case 'Custom':
        case undefined:
        case null:
            for (const [eventKey, event] of Object.entries(action.events ?? {})) {
                for (const [key, a] of Object.entries(event?.actions ?? {})) {
                    yield* getActionsInAction(a, [
                        ...path,
                        'events',
                        eventKey,
                        'actions',
                        key,
                    ]);
                }
            }
            break;
        case 'Switch':
            for (const [key, c] of (action.cases ?? []).entries()) {
                for (const [actionKey, a] of Object.entries(c?.actions ?? {})) {
                    yield* getActionsInAction(a, [
                        ...path,
                        'cases',
                        key,
                        'actions',
                        actionKey,
                    ]);
                }
            }
            for (const [actionKey, a] of Object.entries(action.default?.actions ?? [])) {
                yield* getActionsInAction(a, [...path, 'default', 'actions', actionKey]);
            }
            break;
    }
}
export const isLegacyPluginAction = (action) => {
    return !('version' in action);
};
//# sourceMappingURL=actionUtils.js.map