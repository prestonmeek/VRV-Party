'use strict';

class Socket {
    constructor() {
        this.videoID = 'player_html5_api'; // id of video element

        this.socket = io('http://127.0.0.1:3000', {
            reconnection: false
        });

        this.events = [
            'connect',
            'host',
            'pause',
            'play'
        ];

        this.init();
    }

    init() {
        this.events.forEach(e => {
            this.socket.on(e, args => {
                let func = this['handle' + e.charAt(0).toUpperCase() + e.slice(1)].bind(this);

                if (func && typeof func == 'function')
                    func(args);
            });
        });
    }

    handleConnect() {
        const query  = URI(document.referrer).query(true);
        const roomID = jQuery.isEmptyObject(query) ? null : String(query.id); // just checking if there is a room ID or not
        
        if (roomID)
            this.socket.emit('joining room', roomID);
    }

    handleHost(bool) { // it has been determined if the client is the host or not
        this.socket.host = bool;

        waitUntilExists(this.videoID).then(video => { // ready to handle video events
            this.video = video[0];         // video element
            new Video(video, this.socket);
        });
    }

    handlePause() {
        this.video.pause();
    }

    handlePlay(time) {
        this.video.currentTime = time;
        this.video.play();
    }
}

new Socket();