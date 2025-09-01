const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
    
    // Generic message handling
    socket.on('message', (data) => {
      io.emit('message', {
        id: socket.id,
        text: data.text,
        timestamp: new Date()
      });
    });
  });
};

module.exports = {
  setupSockets
};
