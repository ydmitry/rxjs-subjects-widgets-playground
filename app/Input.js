import mapObjIndexed from 'ramda/src/mapObjIndexed';
import not from 'ramda/src/not';
import compose from 'ramda/src/compose';
import shallowEqual from 'shallowequal';

export default class Input {
    constructor(options) {
        this.el = options.el;
        this.widgetStoreDispatcher$ = options.widgetStoreDispatcher$;
        this.widgetStoreState$ = options.widgetStoreState$;

        this.name = this.el.dataset.name;

        this.widgetStoreState$
            .map(this.mapStoreToState.bind(this))
            //.distinctUntilChanged(x => x, compose(not, shallowEqual))
            //.distinctUntilChanged(x => {
            //    debugger;
            //    return x;
            //}, (a, b) => {
            //    debugger;
            //    return !shallowEqual(a, b);
            //})
            .subscribe(this.render.bind(this));

        this.onChange = this.onChange.bind(this);
        this.el.querySelector('input').addEventListener('keyup', this.onChange);
    }

    render(state) {
        let input = this.el.querySelector('input');
        input.value = state.value;
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
        debugger;
        return {
            value: store.form[this.name] || ''
        };
    }
}
