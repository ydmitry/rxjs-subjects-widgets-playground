import mapObjIndexed from 'ramda/src/mapObjIndexed';
import shallowEqual from 'shallowequal';

export default class Label {
    constructor(options) {

        this.el = options.el;
        this.widgetStoreState$ = options.widgetStoreState$;
        this.name = this.el.dataset.name;

        this.widgetStoreState$
            .map(this.mapStoreToState.bind(this))
            .distinctUntilChanged(x => x, shallowEqual)
            .subscribe(this.render.bind(this));
    }

    render(state) {
        this.el.innerHTML = state.message;
    }

    mapStoreToState(store) {
        return {
            message: store.validationMessages[this.name] || ''
        };
    }
}
