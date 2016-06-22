export default function attach({
    widgetStreamsSubject, globalStreamsSubject,
    widgetStoreDispatcher$, globalStoreDispatcher$,
    widgetStoreState$, globalStoreState$
}) {
    return function(Component) {
        return function(el) {
            new Component({
                el,
                widgetStreamsSubject, globalStreamsSubject,
                widgetStoreDispatcher$, globalStoreDispatcher$,
                widgetStoreState$, globalStoreState$
            })
        }
    };
}
