-- ============================================
  -- PHASE 2: REAL-TIME CHAT SYSTEM
  -- Database Schema
  -- Date: 2025-10-13
  -- ============================================

  -- Table 1: Chat Channels
  CREATE TABLE IF NOT EXISTS chat_channels (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      channel_type VARCHAR(50) NOT NULL DEFAULT 'project',
      name VARCHAR(255),
      description TEXT,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
  );

  COMMENT ON TABLE chat_channels IS 'Stores chat channels (project channels or direct messages)';
  COMMENT ON COLUMN chat_channels.channel_type IS 'Type: project, direct, group';
  COMMENT ON COLUMN chat_channels.project_id IS 'Linked project (NULL for direct messages)';

  -- Table 2: Channel Members
  CREATE TABLE IF NOT EXISTS channel_members (
      id SERIAL PRIMARY KEY,
      channel_id INTEGER NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR(50) DEFAULT 'member',
      last_read_at TIMESTAMP,
      notification_enabled BOOLEAN DEFAULT true,
      joined_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(channel_id, user_id)
  );

  COMMENT ON TABLE channel_members IS 'Tracks who has access to which channels';
  COMMENT ON COLUMN channel_members.last_read_at IS 'When user last read messages in this channel';

  -- Table 3: Messages
  CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      channel_id INTEGER NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      message_type VARCHAR(50) DEFAULT 'text',
      content TEXT,
      attachments JSONB,
      reply_to_message_id INTEGER REFERENCES messages(id) ON DELETE SET NULL,
      is_edited BOOLEAN DEFAULT false,
      edited_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
  );

  COMMENT ON TABLE messages IS 'Stores all chat messages';
  COMMENT ON COLUMN messages.message_type IS 'Type: text, file, image, system';
  COMMENT ON COLUMN messages.attachments IS 'JSON array of file attachments';
  COMMENT ON COLUMN messages.reply_to_message_id IS 'For threaded replies';

  -- Table 4: Message Reactions
  CREATE TABLE IF NOT EXISTS message_reactions (
      id SERIAL PRIMARY KEY,
      message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      emoji VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(message_id, user_id, emoji)
  );

  COMMENT ON TABLE message_reactions IS 'Emoji reactions to messages';

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_chat_channels_project ON chat_channels(project_id);
  CREATE INDEX IF NOT EXISTS idx_channel_members_channel ON channel_members(channel_id);
  CREATE INDEX IF NOT EXISTS idx_channel_members_user ON channel_members(user_id);
  CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
  CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);
  CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON message_reactions(message_id);

  -- ============================================
  -- MIGRATION COMPLETE
  -- ============================================