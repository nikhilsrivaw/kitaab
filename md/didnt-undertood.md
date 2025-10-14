 Get user's channels:
  SELECT
      c.id, c.project_id, c.name, c.created_at,
      p.name as project_name
  FROM chat_channels c
  JOIN channel_members cm ON c.id = cm.channel_id
  LEFT JOIN projects p ON c.project_id = p.id
  WHERE cm.user_id = $1
  ORDER BY c.created_at DESC

  Get channel with messages:
  -- First check membership
  SELECT * FROM channel_members
  WHERE channel_id = $1 AND user_id = $2

  -- Then get messages
  SELECT
      m.*,
      u.name as sender_name
  FROM messages m
  JOIN users u ON m.user_id = u.id
  WHERE m.channel_id = $1
  ORDER BY m.created_at DESC
  LIMIT 50

  Create channel:
  -- Insert channel
  INSERT INTO chat_channels (project_id, channel_type, name, created_by)
  VALUES ($1, 'project', $2, $3)
  RETURNING *

  -- Add member
  INSERT INTO channel_members (channel_id, user_id)
  VALUES ($1, $2)

  ---

  ---
  🔍 Query 1: Get User's Channels

  SELECT
      c.id, c.project_id, c.name, c.created_at,
      p.name as project_name
  FROM chat_channels c
  JOIN channel_members cm ON c.id = cm.channel_id
  LEFT JOIN projects p ON c.project_id = p.id
  WHERE cm.user_id = $1
  ORDER BY c.created_at DESC

  ---
  📖 Step-by-Step Explanation:

  Scenario: Nikhil logs in. Show him ALL channels he has access to.

  Tables involved:
  - chat_channels (c) - The channels
  - channel_members (cm) - Who's in which channel
  - projects (p) - Project details

  ---
  🎯 Breaking It Down:

  Line 1-2: SELECT what we want

  SELECT
      c.id, c.project_id, c.name, c.created_at,
      p.name as project_name

  What we're getting:
  - c.id → Channel ID (e.g., 5)
  - c.project_id → Which project? (e.g., 10)
  - c.name → Channel name (e.g., "Website Redesign Chat")
  - c.created_at → When was it created?
  - p.name as project_name → Actual project name (e.g., "Website Redesign")

  ---
  Line 3: FROM chat_channels c

  FROM chat_channels c

  Start from: The chat_channels table (we call it c for short)

  Example data in chat_channels:
  | id  | project_id | name                  | created_by |
  |-----|------------|-----------------------|------------|
  | 1   | 5          | Website Redesign Chat | 1          |
  | 2   | 8          | Mobile App Chat       | 2          |
  | 3   | 5          | E-commerce Chat       | 1          |

  ---
  Line 4: JOIN channel_members

  JOIN channel_members cm ON c.id = cm.channel_id

  Why JOIN? We need to know WHO is in each channel!

  Example data in channel_members:
  | id  | channel_id | user_id    |
  |-----|------------|------------|
  | 1   | 1          | 1 (Nikhil) |
  | 2   | 1          | 2 (Mridul) |
  | 3   | 2          | 2 (Mridul) |
  | 4   | 3          | 1 (Nikhil) |

  What JOIN does: Combine channels with their members

  Result after JOIN:
  | c.id | c.name                | cm.user_id |
  |------|-----------------------|------------|
  | 1    | Website Redesign Chat | 1 (Nikhil) |
  | 1    | Website Redesign Chat | 2 (Mridul) |
  | 2    | Mobile App Chat       | 2 (Mridul) |
  | 3    | E-commerce Chat       | 1 (Nikhil) |

  ---
  Line 5: LEFT JOIN projects

  LEFT JOIN projects p ON c.project_id = p.id

  Why LEFT JOIN? Get project name for display!

  LEFT JOIN vs JOIN:
  - JOIN = Only rows that match in BOTH tables
  - LEFT JOIN = All rows from left table, even if no match in right table

  Why LEFT? Some channels might not have a project (direct messages have project_id = NULL)

  Example projects:
  | id  | name             | user_id |
  |-----|------------------|---------|
  | 5   | Website Redesign | 1       |
  | 8   | Mobile App       | 2       |

  After LEFT JOIN:
  | c.id | c.name                | p.name (project_name) |
  |------|-----------------------|-----------------------|
  | 1    | Website Redesign Chat | Website Redesign      |
  | 2    | Mobile App Chat       | Mobile App            |
  | 3    | Direct Message        | NULL (no project)     |

  ---
  Line 6: WHERE filter

  WHERE cm.user_id = $1

  Filter: Only channels where Nikhil (user_id = 1) is a member!

  If Nikhil's user_id = 1:
  - ✅ Channel 1 (Nikhil is member)
  - ❌ Channel 2 (Nikhil is NOT member)
  - ✅ Channel 3 (Nikhil is member)

  Result: Only channels 1 and 3

  ---
  Line 7: ORDER BY

  ORDER BY c.created_at DESC

  Sort: Newest channels first (DESC = descending)

  ---
  🎯 Final Result for Nikhil:

  | id  | project_id | name                  | project_name     |
  |-----|------------|-----------------------|------------------|
  | 3   | 5          | E-commerce Chat       | E-commerce       |
  | 1   | 5          | Website Redesign Chat | Website Redesign |

  This is what appears in Nikhil's sidebar! 📱

  ---
  🔍 Query 2: Get Channel with Messages

  -- First check membership
  SELECT * FROM channel_members
  WHERE channel_id = $1 AND user_id = $2

  -- Then get messages
  SELECT
      m.*,
      u.name as sender_name
  FROM messages m
  JOIN users u ON m.user_id = u.id
  WHERE m.channel_id = $1
  ORDER BY m.created_at DESC
  LIMIT 50

  ---
  📖 Part A: Check Membership (Security!)

  SELECT * FROM channel_members
  WHERE channel_id = $1 AND user_id = $2

  Why? Before showing messages, verify user has access!

  Example:
  - Nikhil tries to open channel 5
  - $1 = 5 (channel_id)
  - $2 = 1 (Nikhil's user_id)

  Query checks: Is Nikhil a member of channel 5?

  If NO rows returned: Nikhil is NOT a member → Return 403 Forbidden ❌
  If row returned: Nikhil IS a member → Show messages ✅

  ---
  📖 Part B: Get Messages

  SELECT
      m.*,
      u.name as sender_name
  FROM messages m
  JOIN users u ON m.user_id = u.id
  WHERE m.channel_id = $1
  ORDER BY m.created_at DESC
  LIMIT 50

  Step-by-step:

  Line 1-2: SELECT

  SELECT
      m.*,
      u.name as sender_name

  Get: - m.* → All message data (id, content, created_at, etc.)
 
  - u.name as sender_name → Who sent it? (e.g., "Nikhil")

  ---
  Line 3: FROM messages m

  Start from: messages table

  Example messages:
  | id  | channel_id | user_id | content             | created_at |
  |-----|------------|---------|---------------------|------------|
  | 1   | 5          | 1       | "Hello!"            | 10:00      |
  | 2   | 5          | 2       | "Hi there!"         | 10:01      |
  | 3   | 7          | 1       | "Different channel" | 10:02      |

  ---
  Line 4: JOIN users

  JOIN users u ON m.user_id = u.id

  Why? Messages only have user_id (number). We need the person's NAME!

  Example users:
  | id  | name   |
  |-----|--------|
  | 1   | Nikhil |
  | 2   | Mridul |

  After JOIN:
  | m.id | m.content   | m.user_id | u.name |
  |------|-------------|-----------|--------|
  | 1    | "Hello!"    | 1         | Nikhil |
  | 2    | "Hi there!" | 2         | Mridul |

  ---
  Line 5: WHERE filter

  WHERE m.channel_id = $1

  Filter: Only messages from THIS channel (channel 5)

  Result:
  - ✅ Message 1 (channel 5)
  - ✅ Message 2 (channel 5)
  - ❌ Message 3 (channel 7, different channel)

  ---
  Line 6-7: ORDER and LIMIT

  ORDER BY m.created_at DESC
  LIMIT 50

  ORDER BY DESC: Newest messages first
  LIMIT 50: Only last 50 messages (pagination)

  Final Result:
  | id  | content     | sender_name | created_at |
  |-----|-------------|-------------|------------|
  | 2   | "Hi there!" | Mridul      | 10:01      |
  | 1   | "Hello!"    | Nikhil      | 10:00      |

  ---
  🔍 Query 3: Create Channel

  -- Insert channel
  INSERT INTO chat_channels (project_id, channel_type, name, created_by)
  VALUES ($1, 'project', $2, $3)
  RETURNING *

  -- Add member
  INSERT INTO channel_members (channel_id, user_id)
  VALUES ($1, $2)

  ---
  📖 Part A: Insert Channel

  INSERT INTO chat_channels (project_id, channel_type, name, created_by)
  VALUES ($1, 'project', $2, $3)
  RETURNING *

  Example values:
  - $1 = 5 (project_id = 5)
  - $2 = 'Website Redesign Chat' (name)
  - $3 = 1 (created_by = Nikhil's user_id)

  What happens:
  INSERT INTO chat_channels (project_id, channel_type, name, created_by)
  VALUES (5, 'project', 'Website Redesign Chat', 1)
  RETURNING *

  *RETURNING : Return the newly created row!

  Result:
  {
    "id": 10,
    "project_id": 5,
    "channel_type": "project",
    "name": "Website Redesign Chat",
    "created_by": 1,
    "created_at": "2025-10-13 15:30:00"
  }

  Now we have channel ID = 10!

  ---
  📖 Part B: Add Member

  INSERT INTO channel_members (channel_id, user_id)
  VALUES ($1, $2)

  Example:
  - $1 = 10 (the channel we just created)
  - $2 = 1 (Nikhil's user_id)

  What happens:
  INSERT INTO channel_members (channel_id, user_id)
  VALUES (10, 1)

  Result: Nikhil is now a member of channel 10!

  If project has a client (user_id = 2):
  INSERT INTO channel_members (channel_id, user_id)
  VALUES (10, 2)

  Now both Nikhil AND Mridul are members!

  ---
  🎯 Complete Flow Example:

  Scenario: Nikhil creates a project "Website Redesign" and assigns client Mridul

  Step 1: Create channel
  INSERT INTO chat_channels (project_id, name, created_by)
  VALUES (5, 'Website Redesign Chat', 1)
  RETURNING *
  -- Returns: channel id = 10

  Step 2: Add Nikhil as member
  INSERT INTO channel_members (channel_id, user_id)
  VALUES (10, 1)

  Step 3: Add Mridul as member
  INSERT INTO channel_members (channel_id, user_id)
  VALUES (10, 2)

  Result:
  - ✅ Channel created
  - ✅ Nikhil can access it
  - ✅ Mridul can access it
  - ✅ They can chat in real-time!

  ---
  ✅ Do You Understand Now?

  Test yourself:

  1. Why JOIN channel_members? → To know who's in each channel
  2. Why LEFT JOIN projects? → Some channels might not have projects (direct messages)
  3. Why check membership first? → Security! Don't show messages to non-members
  4. What does RETURNING * do? → Returns the newly created row with its ID
  5. Why LIMIT 50? → Don't load all messages at once (performance)