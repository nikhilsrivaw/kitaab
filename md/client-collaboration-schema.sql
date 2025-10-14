-- ============================================
  -- PHASE 1: CLIENT COLLABORATION SYSTEM
  -- Add Missing Fields for Invitation System
  -- Date: 2025-10-13
  -- ============================================

  -- Step 1: Add user_type to users table
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'freelancer';

  -- Step 2: Add invitation fields to clients table
  ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS invitation_status VARCHAR(50) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS invitation_token VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP;

  -- Step 3: Create project_collaborators table
  CREATE TABLE IF NOT EXISTS project_collaborators (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      role VARCHAR(50) DEFAULT 'client',
      can_view_tasks BOOLEAN DEFAULT false,
      can_view_expenses BOOLEAN DEFAULT false,
      can_view_income BOOLEAN DEFAULT false,
      can_comment BOOLEAN DEFAULT true,
      added_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(project_id, client_id)
  );

  -- Step 4: Add client_id to projects table
  ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL;

  -- Step 5: Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
  CREATE INDEX IF NOT EXISTS idx_clients_invitation_token ON clients(invitation_token);
  CREATE INDEX IF NOT EXISTS idx_project_collaborators_project ON project_collaborators(project_id);
  CREATE INDEX IF NOT EXISTS idx_project_collaborators_client ON project_collaborators(client_id);
  CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);

  -- ============================================
  -- MIGRATION COMPLETE
  -- ============================================