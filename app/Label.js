import mapObjIndexed from 'ramda/src/mapObjIndexed';
import shallowEqual from 'shallowequal';

export default class Label {
    constructor(options) {
        //mapObjIndexed((v, i) => {
        //    this[i] = v;
        //}, options);

        this.el = options.el;
        this.widgetStreamsSubject = options.widgetStreamsSubject;

        this.state = {};
        this.name = this.el.dataset.name;

        this.widgetStreamsSubject('store')
            .asObservable()
            .map(this.mapStoreToState.bind(this))
            .filter(newState => !shallowEqual(newState, this.state))
            .subscribe(state => {
                this.state = state;
                this.render();
            });
    }

    render() {
        this.el.innerHTML = this.state.value;
    }

    mapStoreToState(store) {
        return {
            value: store.form[this.name] || ''
        };
    }
}
