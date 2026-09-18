import { measure } from '@nordcraft/core/dist/utils/measure';
import fastDeepEqual from 'fast-deep-equal';
import { handleAction } from '../events/handleAction';
import { BatchQueue } from '../utils/BatchQueue';
import { createNode } from './createNode';
const BATCH_QUEUE = new BatchQueue();
export function renderComponent({ component, dataSignal, onEvent, isRootComponent, path, children, formulaCache, components, apis, abortSignal, root, providers, package: packageName, stores, parentElement, instance, toddle, namespace, env, jsonPath, reportFormulaEvaluation, }) {
    const stopMeasure = measure(`Render component: ${component.name}`, {
        component: component.name,
        path,
    }, 'component');
    const ctx = {
        triggerEvent: onEvent,
        component,
        components,
        dataSignal,
        isRootComponent,
        apis,
        formulaCache,
        children,
        abortSignal,
        root,
        providers,
        stores,
        package: packageName,
        toddle,
        env,
        jsonPath,
        reportFormulaEvaluation,
    };
    const rootElem = createNode({
        id: 'root',
        path,
        dataSignal,
        ctx: { ...ctx, jsonPath: ['nodes', 'root'] },
        parentElement,
        namespace,
        instance,
    });
    BATCH_QUEUE.add(() => {
        let prev;
        if (component.onAttributeChange?.actions &&
            component.onAttributeChange.actions.length > 0) {
            dataSignal
                .map((data) => data.Attributes)
                .subscribe((props) => {
                if (prev) {
                    component.onAttributeChange?.actions?.forEach((action) => {
                        void handleAction(action, dataSignal.get(), ctx, new CustomEvent('attribute-change', {
                            detail: Object.entries(props).reduce((changes, [key, value]) => {
                                if (fastDeepEqual(value, prev[key]) === false &&
                                    component.attributes?.[key]?.name) {
                                    changes[component.attributes?.[key]?.name] = {
                                        current: prev[key],
                                        new: value,
                                    };
                                }
                                return changes;
                            }, {}),
                        }));
                    });
                }
                prev = props;
            });
        }
        component.onLoad?.actions?.forEach((action) => {
            void handleAction(action, dataSignal.get(), ctx);
        });
    });
    stopMeasure();
    return rootElem;
}
//# sourceMappingURL=renderComponent.js.map