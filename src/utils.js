'use strict';

const videoID = '#player_html5_api'; // id of video element

console.log('weewee');

const waitUntilVideoExists = (tick = 250) => {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const el = $(videoID);
            
            if (el.length && el.hasClass('vjs-tech')) { // if the parent div and the video element exist
                clearInterval(interval);
                resolve(el);
            }
        }, tick);
    });
}