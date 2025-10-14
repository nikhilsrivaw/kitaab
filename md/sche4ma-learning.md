---
  🧠 Understanding the Chat Database Schema

  Let's use a real-world scenario to understand how everything connects:

  ---
  📖 The Scenario:

  Nikhil (Freelancer) is working on "Website Redesign" project for Mridul (Client). They need to chat about the project.

  ---
  🗂️ Table 1: chat_channels

  Think of it like: A WhatsApp group or Slack channel

  What it stores: The "room" where conversations happen

  Example Data:

  | id  | project_id | channel_type | name                  | created_by |
  |-----|------------|--------------|-----------------------|------------|
  | 1   | 5          | project      | Website Redesign Chat | 1 (Nikhil) |
  | 2   | NULL       | direct       | Nikhil ↔ Mridul DM    | 1 (Nikhil) |

  Columns Explained:

  - id: Unique channel ID
  - project_id: Which project is this channel for? (5 = Website Redesign project)
    - If NULL → it's a direct message, not project-related
  - channel_type:
    - 'project' = Channel for a specific project
    - 'direct' = 1-on-1 direct message
    - 'group' = Future feature for team chats
  - name: Channel name (like "Website Redesign Chat")
  - created_by: Who created this channel

  Why do we need this?
  - Each project gets its own chat room
  - People can also have private DMs
  - Keeps conversations organized

  ---
  👥 Table 2: channel_members

  Think of it like: The member list of a WhatsApp group

  What it stores: Who has access to which channel

  Example Data:

  | id  | channel_id | user_id    | last_read_at     | notification_enabled |
  |-----|------------|------------|------------------|----------------------|
  | 1   | 1          | 1 (Nikhil) | 2025-10-13 10:30 | true                 |
  | 2   | 1          | 2 (Mridul) | 2025-10-13 10:25 | true                 |

  Columns Explained:

  - channel_id: Which channel is this? (1 = Website Redesign Chat)
  - user_id: Which user is in this channel? (1 = Nikhil, 2 = Mridul)
  - last_read_at: When did this user last check messages?
    - Used to calculate unread message count
    - Example: Nikhil read at 10:30, Mridul at 10:25
    - Any messages after 10:25 are "unread" for Mridul
  - notification_enabled: Does this user want notifications for this channel?

  Why do we need this?
  - Controls who can see which channels
  - Tracks unread messages per user
  - If you're not in channel_members, you CAN'T see the channel

  Security:
  - Even if you guess a channel_id, you can't access it unless you're in channel_members!

  ---
  💬 Table 3: messages

  Think of it like: The actual chat messages (like WhatsApp messages)

  What it stores: Every message sent in every channel

  Example Data:

  | id  | channel_id | user_id    | content                                   | reply_to_message_id | created_at |
  |-----|------------|------------|-------------------------------------------|---------------------|------------|
  | 1   | 1          | 1 (Nikhil) | "Hi Mridul! Ready to discuss the design?" | NULL                | 10:20      |
  | 2   | 1          | 2 (Mridul) | "Yes! Can we change the header color?"    | NULL                | 10:22      |
  | 3   | 1          | 1 (Nikhil) | "Sure! What color do you prefer?"         | 2                   | 10:23      |

  Columns Explained:

  - channel_id: Which channel is this message in? (1 = Website Redesign Chat)
  - user_id: Who sent this message?
  - content: The actual message text
  - message_type:
    - 'text' = Regular text message
    - 'file' = File attachment (PDF, doc, etc.)
    - 'image' = Image attachment
    - 'system' = System message ("Nikhil joined the channel")
  - attachments: JSON array of files
  [
    {
      "url": "https://s3.amazonaws.com/file.pdf",
      "name": "mockup.pdf",
      "size": 2048576,
      "type": "application/pdf"
    }
  ]
  - reply_to_message_id: Is this a reply to another message?
    - Message 3 is a reply to Message 2 (threading!)
    - Like when you reply to a specific message in WhatsApp
  - is_edited: Did user edit this message after sending?
  - edited_at: When was it edited?

  Why do we need this?
  - Stores the conversation history
  - Supports file sharing
  - Supports threaded replies
  - Can search through old messages

  ---
  😊 Table 4: message_reactions

  Think of it like: WhatsApp reactions (👍 ❤️ 😊)

  What it stores: Who reacted with what emoji to which message

  Example Data:

  | id  | message_id | user_id    | emoji | created_at |
  |-----|------------|------------|-------|------------|
  | 1   | 2          | 1 (Nikhil) | 👍    | 10:22      |
  | 2   | 2          | 2 (Mridul) | ❤️    | 10:23      |
  | 3   | 3          | 2 (Mridul) | 😊    | 10:24      |

  Columns Explained:

  - message_id: Which message got the reaction? (2 = Mridul's message)
  - user_id: Who reacted? (1 = Nikhil)
  - emoji: What emoji? (👍)

  UNIQUE constraint explained:
  UNIQUE(message_id, user_id, emoji)

  This means:
  - ✅ Nikhil can react 👍 to message 2
  - ✅ Mridul can react 👍 to message 2 (different user)
  - ✅ Nikhil can react ❤️ to message 2 (different emoji)
  - ❌ Nikhil CANNOT react 👍 to message 2 AGAIN (duplicate!)

  Why do we need this?
  - Quick feedback without typing
  - Multiple users can react to same message
  - Can show "5 people reacted 👍"

  ---
  🔗 How Everything Connects:

  chat_channels (The room)
      ↓
      ├── channel_members (Who's in the room?)
      │   ├── Nikhil
      │   └── Mridul
      │
      └── messages (What's being said?)
          ├── Message 1: "Hi!"
          ├── Message 2: "Hello!"
          │   └── message_reactions (Reactions to Message 2)
          │       ├── Nikhil: 👍
          │       └── Mridul: ❤️
          └── Message 3: "How are you?"

  ---
  🎯 Real-World Flow:

  When a project is created:

  1. Create project in projects table
  2. Automatically create a channel in chat_channels:
  INSERT INTO chat_channels (project_id, channel_type, name)
  VALUES (5, 'project', 'Website Redesign Chat');
  3. Add freelancer to channel:
  INSERT INTO channel_members (channel_id, user_id)
  VALUES (1, 1); -- Nikhil joins
  4. Add client to channel (if project has a client):
  INSERT INTO channel_members (channel_id, user_id)
  VALUES (1, 2); -- Mridul joins

  When Nikhil sends a message:

  INSERT INTO messages (channel_id, user_id, content)
  VALUES (1, 1, 'Hi Mridul!');

  When Mridul reacts with 👍:

  INSERT INTO message_reactions (message_id, user_id, emoji)
  VALUES (1, 2, '👍');

  To get unread message count for Mridul:

  SELECT COUNT(*)
  FROM messages
  WHERE channel_id = 1
  AND created_at > (
      SELECT last_read_at
      FROM channel_members
      WHERE channel_id = 1 AND user_id = 2
  );

  ---
  🤔 Common Questions:

  Q1: Why separate chat_channels and channel_members?

  A: So one channel can have multiple members!

  - Wrong way: Store members in channels table as JSON → Hard to query
  - Right way: Separate table → Easy to add/remove members, query "all channels for a user"

  ---
  Q2: Why store last_read_at in channel_members?

  A: To calculate unread messages per user!

  - Nikhil might have read all messages (no unread)
  - But Mridul might have 5 unread messages
  - Each user has their own last_read_at timestamp

  ---
  Q3: Why JSONB for attachments instead of separate table?

  A: Simplicity and flexibility!

  - One message can have multiple files (array)
  - Don't need complex joins for every message
  - JSONB is searchable in PostgreSQL

  ---
  Q4: What's the difference between project_id = NULL and project_id = 5?

  A:
  - project_id = 5 → Channel is for project 5 (project chat)
  - project_id = NULL → Not linked to any project (direct message)

  ---
  🎓 Key Takeaways:

  1. chat_channels = The conversation room
  2. channel_members = Who's allowed in the room
  3. messages = What people say in the room
  4. message_reactions = Quick emoji feedback

  Relationships:
  - One channel has many members
  - One channel has many messages
  - One message has many reactions
  - One user can be in many channels

  ---
  ✅ Do You Understand Now?

  Test yourself:
  - Where is "Hi Mridul!" stored? → messages table
  - How do we know Nikhil can see channel 1? → He's in channel_members for channel 1
  - Where is the 👍 reaction stored? → message_reactions table
  - How do we find unread messages? → Compare message created_at with user's last_read_at

  🎯 Explaining Each Index for Chat System:

  1. idx_chat_channels_project

  CREATE INDEX ON chat_channels(project_id);

  Without Index:
  - "Show me the chat channel for project 5"
  - Checks every channel: 1, 2, 3, 4, 5 ✅, 6, 7...
  - Checks 10,000 channels

  With Index:
  - Looks at catalog: "Project 5 → Channel 12"
  - Goes directly to channel 12
  - Instant! ⚡

  Use Case: When you open a project, load its chat channel immediately

  ---
  2. idx_channel_members_channel

  CREATE INDEX ON channel_members(channel_id);

  Without Index:
  - "Who are the members of channel 5?"
  - Checks every row: channel 1 member, channel 2 member... channel 5 member ✅

  With Index:
  - Catalog: "Channel 5 members → Rows 100-102"
  - Direct access!

  Use Case: Show "Nikhil, Mridul" in the channel members list

  ---
  3. idx_channel_members_user

  CREATE INDEX ON channel_members(user_id);

  Without Index:
  - "Show all channels that Nikhil (user_id = 1) is in"
  - Checks all 50,000 channel_members rows

  With Index:
  - Catalog: "User 1 → Rows 5, 89, 234, 567"
  - Direct access!

  Use Case: When Nikhil logs in, show him HIS channels in the sidebar

  ---
  4. idx_messages_channel

  CREATE INDEX ON messages(channel_id);

  Without Index:
  - "Load all messages from channel 5"
  - Checks all 1,000,000 messages in database

  With Index:
  - Catalog: "Channel 5 messages → Rows 50,000-50,500"
  - Direct access!

  Use Case: When you open a channel, load its messages FAST!

  This is THE MOST IMPORTANT index for chat! You'll use it constantly!

  ---
  5. idx_messages_user

  CREATE INDEX ON messages(user_id);

  Without Index:
  - "Show all messages sent by Nikhil"
  - Checks all 1,000,000 messages

  With Index:
  - Catalog: "User 1 messages → Rows 1000-5000"
  - Direct access!

  Use Case: User profile page showing "All messages sent by this user"

  ---
  6. idx_messages_created (Special!)

  CREATE INDEX ON messages(created_at DESC);

  Without Index:
  - "Show messages sorted by newest first"
  - Loads all messages → sorts them → takes time

  With Index:
  - Messages are ALREADY sorted in the index!
  - Just read them in order from index

  DESC = Descending = Newest first

  Use Case:
  - Chat always shows newest messages at bottom
  - Pagination: "Load last 50 messages" → Super fast!

  ---
  7. idx_message_reactions_message

  CREATE INDEX ON message_reactions(message_id);

  Without Index:
  - "Show all reactions for message 100"
  - Checks all reaction rows

  With Index:
  - Catalog: "Message 100 reactions → Rows 500-505"
  - Direct access!

  Use Case: Display "5👍 3❤️ 2😊" under a message

  ---
  🚀 Real Performance Numbers (Chat System):

  Loading Channel Messages (Most Common Operation):

  WITHOUT idx_messages_channel:
  SELECT * FROM messages WHERE channel_id = 5;
  - 1,000 messages: 200ms
  - 10,000 messages: 2 seconds
  - 100,000 messages: 20 seconds ❌ TERRIBLE!

  WITH idx_messages_channel:
  SELECT * FROM messages WHERE channel_id = 5;
  - 1,000 messages: 5ms
  - 10,000 messages: 10ms
  - 100,000 messages: 15ms ✅ INSTANT!

  40x to 1000x faster! 🚀

  ---
  🎓 Key Takeaway:

  Indexes are like shortcuts in a video game!

  - No index: Must walk through entire map to find treasure
  - With index: Fast travel directly to treasure location! 🗺️⚡

  For chat systems: Indexes are CRITICAL because:
  - Users expect instant message loading
  - Messages are queried constantly (every channel open)
  - Large message history (100,000+ messages)

  ---
  ✅ Final Question:

  If you have 1 million messages across 500 channels, and you want to load channel 250's messages:

  Without index: How many rows checked? → 1,000,000 (all messages)
  With index: How many rows checked? → ~2,000 (only channel 250's messages)

  That's a 500x speed improvement! ⚡

  ---
  Do you fully understand indexes now? 🎯
