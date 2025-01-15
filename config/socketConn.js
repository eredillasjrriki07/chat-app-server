const socketConnection = (io) => {

    io.on('connection', socket => {

        io.emit("updateChat");

        socket.on('sendMessage', (payload) => {
            socket.to(payload.conversationId).emit('receiveMessage', payload);
            io.emit("updateChat");
        });

        socket.on('joinRoom', room => {
            socket.join(room);
            io.emit("updateChat");
        });

    });

};

module.exports = socketConnection;