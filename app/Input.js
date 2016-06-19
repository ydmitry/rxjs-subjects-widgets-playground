import mapObjIndexed from 'ramda/src/mapObjIndexed';
import shallowEqual from 'shallowequal';

export default class Input {
    constructor(options) {
        mapObjIndexed((v, i) => {
            this[i] = v;
        }, options);

        this.state = {};

        this.widgetStreamsSubject('store')
            .asObservable()
            .map(this.mapStoreToState)
            .filter(newState => !shallowEqual(newState, this.state))
            .subscribe(state => {
                this.state = state;
                this.render();
            });

        this.onChange = this.onChange.bind(this);
        this.el.querySelector('input').addEventListener('keyup', this.onChange);
    }

    render() {
        let input = this.el.querySelector('input');
        input.value = this.state.value;
    }

    onChange(e) {

        console.log('onChange');

        this.widgetStreamsSubject('form').next({
            type: 'change',
            name: 't',
            value: e.target.value
        });

        return false;
    }

    mapStoreToState(store) {
        return {
            value: store.form.t || ''
        };
    }
}
