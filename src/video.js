'use strict';

class Video {
    constructor(video, socket) {
        this.videoObject = video;     // jquery object
        this.video       = video[0];  // video element
        this.socket      = socket;

        this.events = [
            'pause',
            'play'
        ];

        this.init();
    }

    init() {
        console.log(this.videoObject);

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.message == "hi")
                console.log('holy shit');
        });

        this.events.forEach(e => {
            this.videoObject.on(e, () => {
                let func = this['handle' + e.charAt(0).toUpperCase() + e.slice(1)].bind(this);

                if (func && typeof func == 'function')
                    func();
            });
        });
    }

    handlePause() {
        console.log('paused');

        if (this.socket.host)
            this.socket.emit('pause');
    }

    handlePlay() {
        if (this.socket.host)
            this.socket.emit('play', {videoTime: this.video.currentTime, time: new Date().getTime()});
    }
}