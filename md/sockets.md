// When user connects
  io.on('connection', (socket) => {
      console.log('New phone call from:', socket.id);
      // socket = this specific connection
  });

  Each user has their own socket (phone line)!

  - Nikhil connects → Gets socket #1
  - Mridul connects → Gets socket #2
  - Each socket is independent

  2. Events = Messages You Send

  Think of events like SMS messages with different types:

  Client → Server (Sending):
  // Client sends event to server
  socket.emit('message:send', {
      channelId: 5,
      content: 'Hello!'
  });

  Server Receives:
  // Server listens for this event
  socket.on('message:send', (data) => {
      console.log('Received:', data);
      // { channelId: 5, content: 'Hello!' }
  });

  Events are custom! You name them whatever you want:
  - 'message:send'
  - 'typing:start'
  - 'user:online'

  ---

  3. Rooms = Group Chats

  Think of rooms like WhatsApp groups:

  Join a room:
  socket.join('channel-5');
  // User joins the "channel-5" group

  Send message to everyone in a room:
  io.to('channel-5').emit('message:new', {
      text: 'Hello everyone in channel 5!'
  });
  // Everyone in channel-5 receives this!

  A) To ONE specific user:
  io.to(`user-${userId}`).emit('notification', 'You have a new message');
  // Only that user receives

  B) To EVERYONE in a room:
  io.to('channel-5').emit('message:new', messageData);
  // Everyone in channel-5 receives

  C) To EVERYONE except sender:
  socket.broadcast.to('channel-5').emit('typing', 'Nikhil is typing...');
  // Everyone except the sender sees "Nikhil is typing"

               // CLIENT (Nikhil's browser)
  socket.emit('message:send', {
      channelId: 5,
      content: 'Hello!'
  });

  ---
  Step 2: Server receives the event

  // SERVER
  socket.on('message:send', async (data) => {
      console.log('Received message from:', socket.userId);
      console.log('Data:', data);
      // { channelId: 5, content: 'Hello!' }

      // Save to database
      const message = await saveMessageToDB(data);
  });

  ---
  Step 3: Server broadcasts to everyone in the channel

  // SERVER (continued)
  io.to(`channel-${data.channelId}`).emit('message:new', {
      id: message.id,
      userId: socket.userId,
      userName: 'Nikhil',
      content: 'Hello!',
      createdAt: new Date()
  });

  ---
  Step 4: All clients in channel 5 receive the message

  // CLIENT (Mridul's browser)
  socket.on('message:new', (message) => {
      console.log('New message:', message);
      // Add message to chat UI
      addMessageToUI(message);
  });