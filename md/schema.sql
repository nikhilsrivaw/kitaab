CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


  CREATE TABLE projects (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE tasks(
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      deadline DATE,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE expenses(
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255),
      description TEXT,
      date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE income(
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    source VARCHAR(255),
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP



);



 CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );


CREATE TABLE task_tags(
      id SERIAL PRIMARY KEY,
      task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE
  );


  
CREATE TABLE clients (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      workspace_id INTEGER,  -- NULL for solo, used later for teams

      -- Basic Info
      name VARCHAR(255) NOT NULL,
      company_name VARCHAR(255),  -- Optional
      email VARCHAR(255) UNIQUE,  -- Unique but can be NULL
      phone VARCHAR(20),

      -- Address
      address TEXT,
      city VARCHAR(100),
      country VARCHAR(100),

      -- Business Info
      website VARCHAR(255),
      industry VARCHAR(100),
      tax_id VARCHAR(50),

      -- Financial
      payment_terms VARCHAR(50) DEFAULT 'net 30',
      hourly_rate DECIMAL(10, 2) DEFAULT 0,
      currency VARCHAR(10) DEFAULT 'USD',

      -- Status & Type
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      client_type VARCHAR(20) NOT NULL DEFAULT 'individual',

      -- Additional
      notes TEXT,
      avatar_url VARCHAR(500),

      -- Timestamps
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );