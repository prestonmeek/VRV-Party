'use strict';

class Socket {
    constructor() {
        this.socket = io('http://127.0.0.1:3000', {
            reconnection: false
        });

        this.events = [
            'connect',
            'host',
            'pause',
            'play'
        ];

        this.chromeEvents = [
            'create room'
        ]

        this.init();
    }

    init() {
        this.events.forEach(e => {
            this.socket.on(e, args => {
                let func = this[functionFormat(e)].bind(this);

                if (func && typeof func == 'function')
                    func(args);
            });
        });

        this.chromeEvents.forEach(e => {
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                let func = this[functionFormat(e)].bind(this);

                if (e == request.event && func && typeof func == 'function')
                    func(sendResponse);
            });
        });
    }

    handleConnect() {
        const query  = URI(document.referrer).query(true);
        const roomID = jQuery.isEmptyObject(query) ? null : String(query.id); // just checking if there is a room ID or not
        
        if (roomID)
            this.socket.emit('join room', roomID);
    }

    handleHost(bool) {                          // it has been determined if the client is the host or not
        this.socket.host = bool;

        waitUntilVideoExists().then(video => {  // ready to handle video events
            this.video = video[0];              // video element
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

    handleCreateRoom() {
        this.socket.emit('create room');
    }
}

new Socket();