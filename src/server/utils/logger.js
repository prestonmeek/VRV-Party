'use strict';

const colors = require('colors');

const types = {
    'write': {
        'tag': 'info', 
        'color': 'green'
    },
    'warn':  {
        'tag': 'warning', 
        'color': 'yellow'
    },
    'error': {
        'tag': 'error', 
        'color': 'red'
    }
}

const getDate = () => {
    const d = new Date();
    const boundGetInfo = getInfo.bind(d);

    return `${Number(boundGetInfo('Month')) + 1}/${boundGetInfo('Date')}/${boundGetInfo('FullYear')} ${boundGetInfo('Hours')}:${boundGetInfo('Minutes')}:${boundGetInfo('Seconds')}`;
}

const createLevel = i => {
    module.exports[i] = data => {
        const obj  = types[i];
        const date = getDate();

        console.log(`[${obj.tag.toUpperCase()}][${date}] > ${data}`[obj.color]);
    }
}

const getInfo = function(type) {
    return this['get' + type]() < 10 ? '0' + this['get' + type]() : this['get' + type]();
}

for (let i in types)
    createLevel(i)
