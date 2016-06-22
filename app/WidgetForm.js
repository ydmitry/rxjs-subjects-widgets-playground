import mapObjIndexed from 'ramda/src/mapObjIndexed';
import isEmpty from 'ramda/src/isEmpty';

export default class WidgetForm {
    constructor(options) {
        //mapObjIndexed((v, i) => {
        //    this[i] = v;
        //}, options);
        this.el = options.el;
        //this.widgetStreamsSubject = options.widgetStreamsSubject;
        //this.globalStreamsSubject = options.globalStreamsSubject;
        this.widgetStoreDispatcher$ = options.widgetStoreDispatcher$;
        this.globalStoreDispatcher$ = options.globalStoreDispatcher$;
        this.widgetStoreState$ = options.widgetStoreState$;
        this.globalStoreState$ = options.globalStoreState$;

        this.global = this.el.dataset.global;

        // Update widget store if actions happened
        this.widgetStoreDispatcher$
            .scan(this.widgetReducer.bind(this), {
                form: {},
                validationMessages: {}
            })
            .subscribe(state => this.widgetStoreState$.onNext(state));

        if (this.global) {

            // Synchronize global and widget stores:

            // 1. Update widget store after receiving global store
            this.globalStoreState$
                .combineLatest(this.widgetStoreState$.startWith({}))
                .distinctUntilChanged(x => x[0])
                .filter(([globalState, widgetState]) => {
                    debugger;
                    return widgetState.form != globalState.searchForm
                })
                .subscribe(([state,]) => {
                    debugger;
                    this.widgetStoreDispatcher$.onNext({
                        type: 'updateForm',
                        form: state.searchForm
                    });
                });

            // 2. Update global store after receiving widget store
            this.widgetStoreState$
                .combineLatest(this.globalStoreState$.startWith({}))
                .distinctUntilChanged(x => x[0])
                .filter(([widgetState, globalState]) => {
                    debugger;
                    return widgetState.form != globalState.searchForm
                })

                .subscribe(([state]) => {
                    debugger;
                    this.globalStoreDispatcher$.onNext({
                        type: 'update',
                        name: 'searchForm',
                        value: state.form
                    });
                });


        }

        this.el.querySelector('button').addEventListener('click', () => {
            this.widgetStoreDispatcher$.onNext({
                type: 'validation'
            });
        });
    }

    widgetReducer(acc, action) {
        acc.form = acc.form || {};
        acc.validationMessages = acc.validationMessages || {};

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
