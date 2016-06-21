import map from 'ramda/src/map';
import Input from './Input';
import Label from './Label';
import Toggle from './Toggle';
import ValidationMessage from './ValidationMessage';
import WidgetForm from './WidgetForm';
import attach from './attach';
import createStreamsSubject from './createStreamsSubject';
import { ReplaySubject, Subject, Observable } from 'rx';

const globalStreamsSubject = createStreamsSubject({});

const globalStore = {};

const globalStoreDispatcher$ = new Subject();
const globalStoreState$ = new ReplaySubject(1);

globalStoreDispatcher$
    .scan(function(acc, action) {

        console.log('scan called', action);
        if (action.type == 'update') {
            acc[action.name] = action.value;
        }

        return acc;
    }, {})
    .subscribe(state => globalStoreState$.onNext(state));


globalStoreDispatcher$.onNext({
    type: 'update',
    name: 'test',
    value: 1
});

globalStoreDispatcher$.onNext({
    type: 'update',
    name: 'abc',
    value: 2
});

globalStoreState$.subscribe(x => {
    console.log('widget 1', x);
});


setTimeout(function() {
    console.log('timeout done');
    globalStoreState$.subscribe(x => {
        console.log('widget 2', x);
    });
}, 2000);

//
//const root = document.getElementById('root');
//
//
//map(el => {
//    const widgetStore = {};
//    const widgetStoreSubject = new ReplaySubject(1);
//    const widgetStreamsSubject = createStreamsSubject({});
//    const attachComponent = attach(
//        widgetStreamsSubject, globalStreamsSubject,
//        widgetStore, globalStore,
//        widgetStoreSubject, globalStoreSubject
//    );
//
//    new WidgetForm({
//        el, widgetStreamsSubject, globalStreamsSubject, widgetStore, globalStore, globalStoreSubject
//    });
//
//    map(attachComponent(Input), el.querySelectorAll('.component-input'));
////    map(attachComponent(Label), el.querySelectorAll('.component-label'));
////    map(attachComponent(ValidationMessage), el.querySelectorAll('.component-validation-message'));
////    map(attachComponent(Toggle), el.querySelectorAll('.component-toggle'));
//
//}, root.querySelectorAll('.widget'));
