export default function attach(widgetStreamsSubject, globalStreamsSubject, widgetStore, globalStore) {
    return function(Component) {
        return function(el) {
            new Component({
                el, widgetStreamsSubject, globalStreamsSubject, widgetStore, globalStore
            })
        }
    };
}
