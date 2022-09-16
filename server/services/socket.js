const {logger} = require('../utils');

const allRooms = {};

module.exports = (io) => {
    io.on('connection', socket => {
        let roomId = "";
        socket.emit('connection-successful', socket.id, () => logger.log(socket.id));

        socket.on('disconnect', () => {
            if (!allRooms[roomId]) {
                return;
            }
            const users = allRooms[roomId].users.filter((user) => user.id !== socket.id);
            logger.log('disconnected', socket.id);
            allRooms[roomId].users = users;
            if (users.length === 0) delete allRooms[roomId];
            socket.to(roomId).emit('remove-peer', socket.id);
        });

        socket.on("join-room", ({roomID, name, avatar}) => {
            if (!roomID) return;
            if (!allRooms[roomID]) {
                allRooms[roomID] = {
                    id: roomID, users: []
                }
            }
            roomId = roomID;
            const {users} = allRooms[roomID];
            let user = users.find(u => u.id === socket.id);
            if (user) return;
            if (users.length >= 4) {
                socket.emit("room-full", {msg: "Room is full"});
                return;
            }
            user = {name: name, id: socket.id, avatar};
            socket.join(roomID);
            socket.emit("add-user", users);
            allRooms[roomID].users = [...users, user];
            logger.log(allRooms);
        });

        socket.on("sending-signal", ({userToSignal, caller, signal}) => {
            if (userToSignal === caller.id) return;
            socket.to(userToSignal).emit('user-joined', {signal, caller});
        });

        socket.on("returning-signal", ({callerID, signal}) => {
            if (socket.id === callerID) return;
            socket.to(callerID).emit('receiving-returned-signal', {signal, id: socket.id});
        });

        socket.on("send-message", ({sender, message}) => {
            socket.broadcast.emit('receive-message', {sender, message});
        });

        socket.on("send-video-is-enabled", (isEnabled) => {
            socket.emit('receive-video-is-enabled', socket.id, isEnabled);
        });
    });
};
