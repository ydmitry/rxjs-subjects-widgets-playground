import { Subject } from 'rxjs';

export default function(streams) {
    return function(name) {
        if (!streams[name]) {
            streams[name] = new Subject();
        }

        return streams[name];
    }
};
