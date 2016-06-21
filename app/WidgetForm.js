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
        this.widgetStoreSubject = options.widgetStoreSubject;
        this.globalStoreSubject = options.globalStoreSubject;

        let formSubject = this.widgetStreamsSubject('form');
        let validationSubject = this.widgetStreamsSubject('validation');

        this.global = this.el.dataset.global;

        this.widgetStore = {
            form: {},
            validationMessages: {}
        };

        // Update widget store if actions happened
        this.widgetStoreSubject
            .asObservable()
            .merge(validationSubject.asObservable())
            .scan(this.widgetReducer.bind(this))
            .subscribe(store => {
                this.widgetStoreSubject.next(store);
            });

        if (this.global) {

            // Synchronize global and widget stores:

            // 1. Update widget store after receiving global store
            this.globalStoreSubject
                .asObservable()
                .combineLatest(this.widgetStoreSubject.asObservable())
                .filter(([store, widgetStore]) => widgetStore.form != store.searchForm)
                .subscribe(store => {
                    this.widgetStoreSubject.next({
                        action: 'updateForm',
                        form: store.searchForm
                    });
                });

            // 2. Update global store after receiving widget store
            this.widgetStoreSubject
                .asObservable()
                .combineLatest(this.globalStoreSubject.asObservable())
                .filter(([store, globalStore]) => globalStore.searchForm != store.form)
                .subscribe(store => {
                    this.globalStoreSubject.next({
                        type: 'update',
                        prop: 'searchForm',
                        value: store.form
                    });
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

            case 'updateForm':
                acc.form = action.form;

                if (!isEmpty(acc.validationMessages)) {
                    acc.validationMessages = this.checkValidationMessages(acc.form);
                }
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
