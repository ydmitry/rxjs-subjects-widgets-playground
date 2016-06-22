import mapObjIndexed from 'ramda/src/mapObjIndexed';
import shallowEqual from 'shallowequal';

export default class Label {
    constructor(options) {

        this.el = options.el;
        this.widgetStoreState$ = options.widgetStoreState$;

        this.state = {};
        this.name = this.el.dataset.name;

        this.widgetStoreState$
            .map(this.mapStoreToState.bind(this))
            .filter(newState => !shallowEqual(newState, this.state))
            .subscribe(state => {
                this.state = state;
                this.render();
            });
    }

    render() {

        this.el.innerHTML = this.state.message;
    }

    mapStoreToState(store) {
        return {
            message: store.validationMessages[this.name] || ''
        };
    }
}
