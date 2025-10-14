const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
    // Step 1: Create Socket.io server
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });

    // Step 2: Authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('No token provided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    // Step 3: Handle connections
    io.on('connection', (socket) => {
        console.log('✅ User connected:', socket.userId);

        // Join personal room
        socket.join(`user-${socket.userId}`);


        socket.on('channel:join', ({ channelId }) => {
            socket.join(`channel-${channelId}`);
            console.log(`User ${socket.userId} joined channel ${channelId}`);
        });



        socket.on('channel:leave', ({ channelId }) => {
            socket.leave(`channel-${channelId}`);
            console.log(`User ${socket.userId} left channel ${channelId}`);
        });

        
        socket.on('typing:start', ({ channelId }) => {
            socket.to(`channel-${channelId}`).emit('user:typing', {
                userId: socket.userId,
                channelId
            });
        });
        socket.on('typing:stop', ({ channelId }) => {
            socket.to(`channel-${channelId}`).emit('user:stopped-typing', {
                userId: socket.userId,
                channelId
            });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('❌ User disconnected:', socket.userId);
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initializeSocket, getIO };