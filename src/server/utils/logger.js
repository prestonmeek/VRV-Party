'use strict';

const colors = require('colors');
const fs     = require('fs');

class Logger {
    constructor(extra) {
        this.types = Object.assign({
            'write': {'tag': 'info', 'color': 'green', 'date': true},
            'warn': {'tag': 'warning', 'color': 'yellow', 'date': true},
            'error': {'color': 'red', 'date': true}
        }, extra);
        this.colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey'];
        this.filePath = __dirname + '/logs.txt';
    }

    init() {
        for (let i in this.types) {
            createLevel.bind(this)(i);
        }
    }

    getDate() {
        let d = new Date();
        return `${(d.getUTCMonth() + 1)}/${d.getUTCDate()}/${d.getUTCFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()}`;
    }
};

const createLevel = function(i) {    
    Logger[i] = data => {
        let date = this.getDate();

        console.log(`${(`[${(this.types[i].tag || i).toUpperCase()}]${this.types[i].date ? `[${date}]` : ''}`)[this.colors.indexOf(this.types[i].color) > -1 ? this.types[i].color : 'green']} > ${data}`);

        if (this.types[i].log == true)
            fs.appendFileSync(this.filePath, `[${(this.types[i].tag || i).toUpperCase()}][${date}] > ${data}\n`, (err) => {if (err) throw err});
    }
}

new Logger().init();

module.exports = Logger;
