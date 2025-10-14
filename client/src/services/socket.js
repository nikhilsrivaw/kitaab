import io from 'socket.io-client';


//socket instance global 
let socket = null;
export const initializeSocket = () => {
    //initialize socket conection 
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('no token found');
        return null;
    }

    socket = io('http://localhost:5000', {
        auth: {
            token: token
        }
    });

    socket.on('connect', () => {
        console.log("✅ Connected to Socket.io server")
    })
    socket.on('disconnect', () => {
        console.log('❌ Disconnected from Socket.io server');
    })
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error.message);
    });

    return socket;
    
}

// Disconnect socket
  export const disconnectSocket = () => {
      if(socket){
        socket.disconnect();
          socket = null;
      }
  };

  // Get socket instance
  export const getSocket = () => {
      return socket;
  };

  // Join a channel
  export const joinChannel = (channelId) => {
      if(socket){
        socket.emit('channel:join', { channelId });
      }
  };

  // Send a message
  export const sendMessage = (channelId, content) => {
      if(socket){
        socket.emit('message:send',{
            channelId,
            content
        });
      }
  };

  // Listen for new messages
  export const onNewMessage = (callback) => {
      if(socket){
        socket.on('message:new' , (message)=>{
            callback(message);
        })
      }
  };

  export const startTyping = (channelId)=>{
    if(socket){
        socket.emit('typing:start' , {channelId})
    }
  }
  export const stopTyping = (channelId)=>{
    if(socket){
        socket.emit('typing:stop' , {channelId})
    }
  }