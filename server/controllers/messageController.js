 const pool = require('../config/db');
  const { getIO } = require('../socket');

  const sendMessage = async (req, res) => {
      const { channel_id, content } = req.body;
      const user_id = req.user.id;

      try {
          // Check membership
          const IsMember = await pool.query(
              'SELECT * FROM channel_members WHERE user_id = $1 AND channel_id = $2',
              [user_id, channel_id]
          );

          if (IsMember.rows.length === 0) {
              return res.status(403).json({
                  message: "You are not a member of this channel"
              });
          }

          // Insert message
          const InsertMessage = await pool.query(
              'INSERT INTO messages (user_id, channel_id, message_type, content) VALUES ($1, $2, $3, $4) RETURNING *',
              [user_id, channel_id, 'text', content]
          );

          const newMessage = InsertMessage.rows[0];

          // Get sender name
          const userResult = await pool.query(
              'SELECT name FROM users WHERE id = $1',
              [user_id]
          );

          const messageWithSender = {
              ...newMessage,
              sender_name: userResult.rows[0].name
          };

          // Broadcast via Socket.io
          const io = getIO();
          io.to(`channel-${channel_id}`).emit('message:new', messageWithSender);

          return res.status(201).json({
              success: true,
              message: messageWithSender
          });

      } catch (error) {
          console.error('Error sending message:', error);
          return res.status(500).json({
              message: error.message
          });
      }
  };

  const getMessages = async (req, res) => {
      const channel_id = req.params.id;
      const user_id = req.user.id;

      try {
          // Check membership
          const IsMember = await pool.query(
              'SELECT * FROM channel_members WHERE user_id = $1 AND channel_id = $2',
              [user_id, channel_id]
          );

          if (IsMember.rows.length === 0) {
              return res.status(403).json({
                  message: "You are not a member of this channel"
              });
          }

          // Get messages
          const getMessage = await pool.query(
              `SELECT m.*, u.name as sender_name
               FROM messages m
               JOIN users u ON m.user_id = u.id
               WHERE m.channel_id = $1
               ORDER BY m.created_at DESC
               LIMIT 50`,
              [channel_id]
          );

          return res.status(200).json({
              success: true,
              messages: getMessage.rows
          });

      } catch (error) {
          console.error('Error getting messages:', error);
          return res.status(500).json({
              message: error.message
          });
      }
  };

  const addReaction = async (req, res) => {
      const { message_id, emoji, channel_id } = req.body;
      const user_id = req.user.id;

      try {
          // Insert reaction
          const InsertReaction = await pool.query(
              `INSERT INTO message_reactions (message_id, user_id, emoji)
               VALUES ($1, $2, $3)
               ON CONFLICT (message_id, user_id, emoji) DO NOTHING
               RETURNING *`,
              [message_id, user_id, emoji]
          );

          if (InsertReaction.rows.length === 0) {
              return res.status(200).json({
                  message: "Reaction already exists"
              });
          }

          // Broadcast via Socket.io
          const io = getIO();
          io.to(`channel-${channel_id}`).emit('reaction:new', {
              message_id,
              user_id,
              emoji
          });

          return res.status(201).json({
              success: true,
              reaction: InsertReaction.rows[0]
          });

      } catch (error) {
          console.error('Error adding reaction:', error);
          return res.status(500).json({
              message: error.message
          });
      }
  };

  module.exports = {
      sendMessage,
      getMessages,
      addReaction
  };