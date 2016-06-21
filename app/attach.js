export default function attach(
    widgetStreamsSubject, globalStreamsSubject,
    widgetStore, globalStore,
    widgetStoreSubject, globalStoreSubject
) {
    return function(Component) {
        return function(el) {
            new Component({
                el,
                widgetStreamsSubject, globalStreamsSubject,
                widgetStore, globalStore,
                widgetStoreSubject, globalStoreSubject
            })
        }
    };
}
