const pool = require('../config/db');

  const getUserChannels = async (req, res) => {
      const userid = req.user.id;

      const query = `
      SELECT c.id, c.project_id, c.name, c.created_at, p.name as project_name
      FROM chat_channels as c
      JOIN channel_members cm ON c.id = cm.channel_id
      LEFT JOIN projects p ON c.project_id = p.id
      WHERE cm.user_id = $1
      ORDER BY c.created_at DESC
      `;

      try {
          const result = await pool.query(query, [userid]);

          if (result.rows.length === 0) {
              return res.status(404).json({
                  message: "No channels found"
              });
          }

          return res.status(200).json({
              success: true,
              channels: result.rows
          });
      } catch (error) {
          return res.status(500).json({
              message: error.message
          });
      }
  };

  const getChannelById = async (req, res) => {
      const channelId = req.params.id;
      const user_id = req.user.id;

      try {
          // Check membership
          const findMemberShip = await pool.query(
              'SELECT * FROM channel_members WHERE channel_id = $1 AND user_id = $2',
              [channelId, user_id]
          );

          if (findMemberShip.rows.length === 0) {
              return res.status(403).json({
                  message: "You don't have access to this channel"
              });
          }

          // Get messages
          const messages = await pool.query(
              `SELECT m.*, u.name as sender_name
               FROM messages m
               JOIN users u ON m.user_id = u.id
               WHERE m.channel_id = $1
               ORDER BY m.created_at DESC
               LIMIT 50`,
              [channelId]
          );

          return res.status(200).json({
              success: true,
              messages: messages.rows
          });
      } catch (error) {
          return res.status(500).json({
              message: error.message
          });
      }
  };

  const createProjectChannel = async (req, res) => {
      const { project_id, project_name } = req.body;
      const userid = req.user.id;

      try {
          // Check if user owns this project
          const userHasProject = await pool.query(
              'SELECT * FROM projects WHERE user_id = $1 AND id = $2',
              [userid, project_id]
          );

          if (userHasProject.rows.length === 0) {
              return res.status(403).json({
                  message: "You don't own this project"
              });
          }

          // Create the channel
          const createChannel = await pool.query(
              `INSERT INTO chat_channels (project_id, channel_type, name, created_by)
               VALUES ($1, 'project', $2, $3)
               RETURNING *`,
              [project_id, project_name, userid]
          );

          const newChannelId = createChannel.rows[0].id;

          // Add freelancer as member
          await pool.query(
              'INSERT INTO channel_members (channel_id, user_id) VALUES ($1, $2)',
              [newChannelId, userid]
          );

          // Check if project has a client
          const projectResult = await pool.query(
              'SELECT client_id FROM projects WHERE id = $1',
              [project_id]
          );

          const clientId = projectResult.rows[0]?.client_id;

          // If project has a client, add them to channel too
          if (clientId) {
              await pool.query(
                  'INSERT INTO channel_members (channel_id, user_id) VALUES ($1, $2)',
                  [newChannelId, clientId]
              );
          }

          return res.status(201).json({
              success: true,
              message: "Channel created successfully",
              channel: createChannel.rows[0]
          });

      } catch (error) {
          console.error('Error creating channel:', error);
          return res.status(500).json({
              message: error.message
          });
      }
  };

  module.exports = {
      getUserChannels,
      getChannelById,
      createProjectChannel
  };
