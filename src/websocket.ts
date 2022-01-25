import WebSocket from 'ws';
import { Server } from 'http';
let ws: WebSocket.Server | null = null;

export function startWebsocket(server: Server) {
    const wsServer = new WebSocket.Server({
        noServer: true,
        path: '/ws'
    });

    let sockets: WebSocket[] = [];
    wsServer.on('connection', function (socket) {
        console.debug('New websocket connection');
        sockets.push(socket);

        // When you receive a message, send that message to every socket.
        socket.on('message', function (msg) {
            sockets.forEach(s => s.send(msg));
        });

        // When a socket closes, or disconnects, remove it from the array.
        socket.on('close', function () {
            sockets = sockets.filter(s => s !== socket);
        });
    });

    // @ts-ignore
    server.on('upgrade', function (req, socket, head) {
        wsServer.handleUpgrade(req, socket, head, webSocket => {
            wsServer.emit('connection', webSocket, req);
        });
    });

    ws = wsServer;

    return wsServer;
}

export function broadcastTaskSolved(task: { teamId: string; taskId: string }) {
    if (ws) {
        ws.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        type: 'taskSolved',
                        payload: task
                    })
                );
            }
        });
    }
}
