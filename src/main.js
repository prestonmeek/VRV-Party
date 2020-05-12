const waitUntilExists = (id, tick = 250) => {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if ($('#' + id)[0]) {
                clearInterval(interval);
                resolve($('#' + id)[0]);
            }
        }, tick);
    });
}

const handleSocketEvents = function(socket) {
    socket.on('connect', () => {
        const roomID = jQuery.isEmptyObject(URI(document.referrer).query(true)) ? null : String(URI(document.referrer).query(true).id);
        
        if (roomID) {
            socket.emit('joining room', roomID);
            console.log('yeeyee' + roomID);
        }
            
    });

    socket.on('host', async bool => {
        socket.host = bool;

        this.video = await waitUntilExists('player_html5_api'); // ready to handle video events
        handleVideoEvents(this.video);
    });

    socket.on('pause', () => {
        this.video.pause();
    });

    socket.on('play', time => {
        console.log(time);
        this.video.currentTime = Math.round(time);
        this.video.play();
    });
}

const handleVideoEvents = video => {
    video.onpause = () => {
        if (socket.host)
            socket.emit('pause');
    }

    video.onplay = () => {
        if (socket.host)
            socket.emit('play', {videoTime: this.video.currentTime, time: new Date().getTime()});
    }
}

const socket = io('http://127.0.0.1:3000', {
    reconnection: false
});

handleSocketEvents(socket);