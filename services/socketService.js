

let socket = {};

module.exports = {
    __init: (io) => {
        io.on('connection', (data) => {
            socket = data;
        });
    },
    send: (channel, msg) => {
        socket.emit(channel, {
            message: msg
        });
    }
}
