'use strict';

const divClass   = '.video-js';         // class of parent div
const divChecker = 'vjs-has-started';   // class of parent div class to check for
const videoID    = '#player_html5_api'; // id of video element

const waitUntilVideoExists = (tick = 250) => {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const div   = $(divClass);
            const video = $(videoID);

            console.log('pog');
            
            if (video.length > 0 && div.hasClass(divChecker)) { // if the video is ready
                clearInterval(interval);
                resolve(video);
            }
        }, tick);
    });
}

const functionFormat = (name) => {
    let res = name.split(' ');

    for (let i in res) {
        res[i] = res[i].charAt(0).toUpperCase() + res[i].slice(1);
    }
    
    return 'handle' + res.join('');
}