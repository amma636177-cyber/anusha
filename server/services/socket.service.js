let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    // Join user personal channel
    socket.on('join:user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    // Join specific group deal live room
    socket.on('join:group', (groupId) => {
      if (groupId) {
        socket.join(`group:${groupId}`);
      }
    });

    socket.on('leave:group', (groupId) => {
      if (groupId) {
        socket.leave(`group:${groupId}`);
      }
    });

    // Join admin live channel
    socket.on('join:admin', () => {
      socket.join('admin:channel');
    });

    socket.on('disconnect', () => {
      // Disconnected cleanly
    });
  });
};

export const getIO = () => ioInstance;

export const emitToGroup = (groupId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`group:${groupId}`).emit(event, data);
    ioInstance.emit('global:group_update', { groupId, ...data });
  }
};

export const emitToUser = (userId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToAdmin = (event, data) => {
  if (ioInstance) {
    ioInstance.to('admin:channel').emit(event, data);
  }
};
