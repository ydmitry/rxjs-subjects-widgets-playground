import mapObjIndexed from 'ramda/src/mapObjIndexed';
export default class WidgetForm {
    constructor(options) {
        mapObjIndexed((v, i) => {
            this[i] = v;
        }, options);

        let widgetStoreSubject = this.widgetStreamsSubject('store');
        let globalStoreSubject = this.globalStreamsSubject('store');
        let formSubject = this.widgetStreamsSubject('form');
        let validationSubject = this.widgetStreamsSubject('validation');

        this.global = this.el.dataset.global;

        if (!this.global) {
            formSubject
                .asObservable()
                .merge(validationSubject.asObservable())
                .scan(this.widgetReducer, this.widgetStore)
                .subscribe(store => {
                    widgetStoreSubject.next(store);
                    //globalStoreSubject.next(store);
                });
        } else {
            formSubject
                .asObservable()
                .scan(this.globalReducer, this.globalStore)
                .subscribe(store => {
                    globalStoreSubject.next(store);
                });

            globalStoreSubject
                .subscribe(store => {
                    widgetStoreSubject.next(store);
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
        switch (action.type) {
            case 'change':
                acc.form[action.name] = action.value;
                if (acc.validationMessages[action.name]) {
                    acc.validationMessages[action.name] = '';
                }
                break;
            case 'validation':
                acc.valid = true;
                if (acc.form.t == '1') {
                    acc.valid = true;
                    acc.validationMessages.t = "Can't be '1'";
                }
                break;
        }

        return acc;
    }

    globalReducer(acc, action) {

        acc.searchForm = acc.searchForm || {};
        switch (action.type) {
            case 'change':
                acc.searchForm[action.name] = action.value;
                break;
        }

        return acc;
    }
}
