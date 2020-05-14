'use strict';

const http   = require('http').createServer();
const io     = require('socket.io')(http);
const logger = require('./logger');

class Server {
    constructor() {
        this.port = Number(process.argv[2]) || 3000;

        this.init();
    }

    init() {
        io.on('connection', socket => {
            logger.write('Socket connected with ID ' + socket.id);
        
            socket.on('joining room', id => {
                logger.write('Socket ' + socket.id + ' joining room with ID ' + id);

                if (!io.sockets.adapter.rooms[id]) // if room doesn't exist
                    socket.emit('host', true);
                else
                    socket.emit('host', false);

                socket.join(id);
            });
        
            socket.on('pause', () => {
                const id = this.getSocketRoom(socket.id);

                logger.write('Pausing video in room ' + id);
                socket.broadcast.to(id).emit('pause');
            });
        
            socket.on('play', data => {
                const id   = this.getSocketRoom(socket.id);
                const time = data.videoTime + (new Date().getTime() - data.time);

                logger.write('Playing video in room ' + id + ' at time ' + time);
                socket.broadcast.to(id).emit('play', time);
            });

            socket.on('disconnect', () => {
                logger.write('Socket ' + socket.id + ' disconnected');
            });
        });

        http.listen(this.port, () => {
            logger.write('Listening on port ' + this.port);
        });
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