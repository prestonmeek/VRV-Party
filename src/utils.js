'use strict';

const waitUntilExists = (id, tick = 250) => {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if ($('#' + id)) {
                clearInterval(interval);
                resolve($('#' + id));
            }
        }, tick);
    });
}