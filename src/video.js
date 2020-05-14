'use strict';

class Video {
    constructor(video, socket) {
        this.videoObject = video;     // jquery object
        this.video       = video[0]; // video element
        this.socket      = socket;

        this.events = [
            'pause',
            'play'
        ];

        this.init();
    }

    init() {
        this.events.forEach(e => {
            this.videoObject.on(e, () => {
                let func = this['handle' + e.charAt(0).toUpperCase() + e.slice(1)].bind(this);

                if (func && typeof func == 'function')
                    func();
            });
        });
    }

    handlePause() {
        if (this.socket.host)
            this.socket.emit('pause');
    }

    handlePlay() {
        if (this.socket.host)
            this.socket.emit('play', {videoTime: this.video.currentTime, time: new Date().getTime()});
    }
}