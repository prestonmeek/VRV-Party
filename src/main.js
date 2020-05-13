const waitUntilExists = (id, tick = 250) => {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if ($('#' + id)) {
                clearInterval(interval);
                resolve($('#' + id));
            }
        }, tick);
    });
}

const handleSocketEvents = function(socket) {
    socket.on('connect', () => {
        const roomID = jQuery.isEmptyObject(URI(document.referrer).query(true)) ? null : String(URI(document.referrer).query(true).id);
        
        if (roomID)
            socket.emit('joining room', roomID);
    });

    socket.on('host', async bool => { // it has been determined if the socket is the host or not
        socket.host = bool;

        waitUntilExists('player_html5_api').then(video => { // ready to handle video events
            this.video = video[0];    // video element
            handleVideoEvents(video); // jquery object
        });
    });

    socket.on('pause', () => {
        this.video.pause();
    });

    socket.on('play', time => {
        this.video.currentTime = time;
        this.video.play();
    });
}

const handleVideoEvents = video => {
    video.on('pause', () => {
        if (socket.host)
            socket.emit('pause');
    });

    video.on('play', () => {
        if (socket.host)
            socket.emit('play', {videoTime: this.video.currentTime, time: new Date().getTime()});
    });
}

const socket = io('http://127.0.0.1:3000', {
    reconnection: false
});

handleSocketEvents(socket);