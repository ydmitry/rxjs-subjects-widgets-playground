import map from 'ramda/src/map';
import Input from './Input';
import Label from './Label';
import Toggle from './Toggle';
import ValidationMessage from './ValidationMessage';
import WidgetForm from './WidgetForm';
import attach from './attach';
import createStreamsSubject from './createStreamsSubject';


const globalStreamsSubject = createStreamsSubject({});

const globalStore = {};

const root = document.getElementById('root');


map(el => {
    const widgetStore = {};
    const widgetStreamsSubject = createStreamsSubject({});
    const attachComponent = attach(widgetStreamsSubject, globalStreamsSubject, widgetStore, globalStore);

    new WidgetForm({
        el, widgetStreamsSubject, globalStreamsSubject, widgetStore, globalStore
    });

    map(attachComponent(Input), el.querySelectorAll('.component-input'));
    map(attachComponent(Label), el.querySelectorAll('.component-label'));
    map(attachComponent(ValidationMessage), el.querySelectorAll('.component-validation-message'));
    map(attachComponent(Toggle), el.querySelectorAll('.component-toggle'));

}, root.querySelectorAll('.widget'));
