import mapObjIndexed from 'ramda/src/mapObjIndexed';
import shallowEqual from 'shallowequal';

export default class Input {
    constructor(options) {
        //mapObjIndexed((v, i) => {
        //    this[i] = v;
        //}, options);

        this.el = options.el;
        this.widgetStoreDispatcher$ = options.widgetStoreDispatcher$;
        this.widgetStoreState$ = options.widgetStoreState$;

        this.name = this.el.dataset.name;
        this.state = {};

        this.widgetStoreState$
            .map(this.mapStoreToState.bind(this))
            .filter(newState => !shallowEqual(newState, this.state))
            .subscribe(this.render.bind(this));

        this.onChange = this.onChange.bind(this);
        this.el.querySelector('input').addEventListener('keyup', this.onChange);
    }

    render(state) {
        let input = this.el.querySelector('input');
        input.value = state.value;
        this.state = state;
    }

    onChange(e) {

        console.log('onChange');

        this.widgetStoreDispatcher$.onNext({
            type: 'change',
            name: this.name,
            value: e.target.value
        });

        return false;
    }

    mapStoreToState(store) {
        return {
            value: store.form[this.name] || ''
        };
    }
}
