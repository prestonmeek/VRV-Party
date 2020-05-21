'use strict';

const videoID = '#player_html5_api'; // id of video element

const waitUntilVideoExists = (tick = 250) => {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if ($(videoID)) { // if the parent div and the video element exist
                clearInterval(interval);
                resolve($(videoID));
            }
        }, tick);
    });
}