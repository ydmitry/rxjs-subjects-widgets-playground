import mapObjIndexed from 'ramda/src/mapObjIndexed';
import shallowEqual from 'shallowequal';

export default class Input {
    constructor(options) {
        this.el = options.el;
        this.widgetStreamsSubject = options.widgetStreamsSubject;
        this.globalStreamsSubject = options.globalStreamsSubject;

        this.state = {};

        this.subject = this.el.dataset.global ? this.globalStreamsSubject('toggle') : this.widgetStreamsSubject('toggle');
        this.name = this.el.dataset.name;
        this.targetName = this.el.dataset.targetName;
        this.trigger = this.el.dataset.trigger;
        this.toggleClass = this.el.dataset.toggleClass;

        this.toggle = this.toggle.bind(this);
        this.click = this.click.bind(this);

        this.name && this.subject
            .filter(action => action.name == this.name)
            .subscribe(this.toggle);

        this.trigger && this.el.addEventListener(this.trigger, this.click);
    }

    toggle(action) {
        this.el.classList.toggle(action.toggleClass);
    }

    click(e) {

        this.subject.onNext({
            name: this.targetName,
            toggleClass: this.toggleClass
        });

        return false;
    }
}
