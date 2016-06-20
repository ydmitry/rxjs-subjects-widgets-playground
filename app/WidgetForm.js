import mapObjIndexed from 'ramda/src/mapObjIndexed';
import isEmpty from 'ramda/src/isEmpty';

export default class WidgetForm {
    constructor(options) {
        //mapObjIndexed((v, i) => {
        //    this[i] = v;
        //}, options);
        this.el = options.el;
        this.widgetStreamsSubject = options.widgetStreamsSubject;
        this.globalStreamsSubject = options.globalStreamsSubject;
        this.widgetStore = options.widgetStore;
        this.globalStore = options.globalStore;

        let widgetStoreSubject = this.widgetStreamsSubject('store');
        let globalStoreSubject = this.globalStreamsSubject('store');
        let formSubject = this.widgetStreamsSubject('form');
        let validationSubject = this.widgetStreamsSubject('validation');

        this.global = this.el.dataset.global;

        this.widgetStore = {
            form: {},
            validationMessages: {}
        };

        // Update widget store if actions happened
        formSubject
            .asObservable()
            .merge(validationSubject.asObservable())
            .scan(this.widgetReducer.bind(this), this.widgetStore)
            .startWith(this.widgetStore)
            .subscribe(store => {
                this.widgetStore = store;
                widgetStoreSubject.next(store);
            });

        if (this.global) {

            // Synchronize global and widget stores:

            // 1. Update widget store after receiving global store
            globalStoreSubject
                .asObservable()
                .filter(store => this.widgetStore.form != store.searchForm)
                .subscribe(store => {
                    this.widgetStore.form = store.searchForm;

                    if (!isEmpty(this.widgetStore.validationMessages)) {
                        this.widgetStore.validationMessages = this.checkValidationMessages(this.widgetStore.form);
                    }

                    widgetStoreSubject.next(this.widgetStore);
                });

            // 2. Update global store after receiving widget store
            widgetStoreSubject
                .asObservable()
                .filter(store => this.globalStore.searchForm != store.form)
                .subscribe(store => {
                    this.globalStore.searchForm = store.form;
                    globalStoreSubject.next(this.globalStore);
                });


        }

        this.el.querySelector('button').addEventListener('click', function() {
            validationSubject.next({
                type: 'validation'
            })
        });
    }

    widgetReducer(acc, action) {

        acc.form = acc.form || {};
        acc.validationMessages = acc.validationMessages || {};
        //debugger;
        switch (action.type) {
            case 'change':
                acc.form = Object.assign({}, acc.form);
                acc.form[action.name] = action.value;
                if (acc.validationMessages[action.name]) {
                    acc.validationMessages[action.name] = '';
                }
                break;
            case 'validation':
                acc.validationMessages = this.checkValidationMessages(acc.form);
                break;
        }

        return acc;
    }

    checkValidationMessages(data) {
        let messages = {};
        if (data.t == '1') {
            messages.t = "Can't be '1'";
        }

        return messages;
    }
}
