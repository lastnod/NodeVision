/// <reference path="./lib/express.d.ts" />
/// <reference path="./lib/serve-static.d.ts" />
/// <reference path="./lib/mime.d.ts" />
/// <reference path="./lib/socketIO.d.ts" />

import * as express from "express";
import * as sio from "socket.io";
import * as http from "http";

class Server {
    private app = express();
    private httpServer = http.createServer(this.app);
    private io = sio.listen(this.httpServer);

    constructor() {
        console.log();
        //routage sur index.html
        this.app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
        //ajout des dépendences
        this.app.use(express.static(__dirname + '/'));
        //connexion & deconnexion
        this.io.on('connection', function (socket: SocketIO.Socket) {
            var date = new Date();
            console.log(date+' : a user connected '+socket.id);

            socket.on('add node srv',(node, edge) => {
                console.log('add node srv');
                socket.broadcast.emit('add node clt', node, edge);
            });

            socket.on('test', () => {
                console.log('testserveur');
                socket.broadcast.emit('tests');
            });

            socket.on('disconnect', function () {
                console.log('user disconnected '+socket.id);
            });
        });
        //montage du server
        this.httpServer.listen(8888, function () {
            console.log('listening on *:8888');
        });
    }
}
new Server();