'use strict';

const http    = require('http').createServer();
const io      = require('socket.io')(http);
const shortid = require('shortid');

const logger             = require('./utils/logger');
const { functionFormat}  = require('./utils/utils');

class Server {
    constructor() {
        this.port = Number(process.argv[2]) || 3000;

        this.events = [
            'pause',
            'play',
            'create room',
            'join room',
            'disconnect'
        ]

        this.init();
    }

    init() {
        io.on('connection', socket => {
            logger.write('Socket connected with ID ' + socket.id);

            this.events.forEach(e => {
                socket.on(e, args => {
                    let func = this[functionFormat(e)].bind(this);
    
                    if (func && typeof func == 'function')
                        func(socket, args);
                });
            });
        });

        http.listen(this.port, () => {
            logger.write('Listening on port ' + this.port);
        });
    }

    handlePause(socket) {
        if (!socket.host) return;

        const id = this.getSocketRoom(socket.id);

        logger.write('Pausing video in room ' + id);
        socket.broadcast.to(id).emit('pause');
    }

    handlePlay(socket, data) {
        if (!socket.host) return;
                
        const id   = this.getSocketRoom(socket.id);
        const time = data.videoTime + (new Date().getTime() - data.time);

        logger.write('Playing video in room ' + id + ' at time ' + time);
        socket.broadcast.to(id).emit('play', time);
    }

    handleCreateRoom(socket) {
        const id = shortid.generate();

        console.log(id);
    }

    handleJoinRoom(socket, id) {
        logger.write('Socket ' + socket.id + ' joining room with ID ' + id);

        if (!io.sockets.adapter.rooms[id]) { // if room doesn't exist
            socket.host = true;
            socket.emit('host', true);
        } else {
            socket.host = false;
            socket.emit('host', false);
        }

        socket.join(id); // joining room
    }

    handleDisconnect(socket) {
        logger.write('Socket ' + socket.id + ' disconnected');
    }

    getSocketRoom(sid) {
        let res = null;

        for (let i in io.sockets.adapter.sids[sid]) { // it returns weird data; this is just to get the room ID
            if (i != sid)
                res = i;
        }

        if (res != null)
            return res;

        logger.error('Socket with ID ' + sid + ' not found in any rooms');
    }
}

new Server;