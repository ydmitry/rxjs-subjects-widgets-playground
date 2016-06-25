import mapObjIndexed from 'ramda/src/mapObjIndexed';
import shallowEqual from 'shallowequal';

export default class Label {
    constructor(options) {
        this.el = options.el;
        this.name = this.el.dataset.name;

        this.widgetStoreDispatcher$ = options.widgetStoreDispatcher$;
        this.widgetStoreState$ = options.widgetStoreState$;

        this.widgetStoreState$
            .map(this.mapStoreToState.bind(this))
            .distinctUntilChanged(x => x, shallowEqual)
            .subscribe(this.render.bind(this));
    }

    render(state) {
        this.el.innerHTML = state.value;
    }

    mapStoreToState(store) {
        return {
            value: store.form[this.name] || ''
        };
    }
}
