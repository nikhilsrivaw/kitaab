This stack will teach you:
  - How the web actually works (frontend ↔ backend ↔ database)
  - Industry-standard tools
  - Skills that translate to any framework later

  ---
  Now Let's Design The Foundation: Database Schema

  This is THE MOST CRITICAL PART. Get this right, everything else becomes easier.

  What is a Database Schema?

  Think of it like architectural blueprints for a house:
  - Each table = a room
  - Columns = what goes in that room
  - Relationships = how rooms connect

  Bad schema = nightmare to code later
  Good schema = code writes itself

  ---
  Teaching Moment: How to Think About Data

  Let's use your project as an example. Ask yourself:

  1. What are the "things" in your app?

  These become TABLES.

  From your app:
  - Users (you for now, but design for multiple)
  - Projects
  - Tasks
  - Expenses
  - Income
  - Tags (maybe?)

  2. What information does each "thing" have?

  These become COLUMNS.

  Example - A Project has:
  - Name
  - Description
  - Created date
  - Status (active/completed)
  - Who owns it (user)

  3. How do "things" relate to each other?

  These become RELATIONSHIPS.

  Example:
  - One User has Many Projects (1-to-many)
  - One Project has Many Tasks (1-to-many)
  - One Project has Many Expenses (1-to-many)
  - One Task can have Many Tags, One Tag can be on Many Tasks (many-to-many)

  ---
  Your Learning Exercise

  I want YOU to design the schema first. Don't worry if it's wrong - that's the point!

  Create a new file: database-schema.md

  In that file, answer this:

  # Database Schema - First Draft

  ## Tables Needed

  1. **Users**
     - What info do we need? (id, email, password, name...?)

  2. **Projects**
     - What info? (id, name, description...?)
     - How does it connect to Users?

  3. **Tasks**
     - What info? (id, title, completed...?)
     - How does it connect to Projects?
     - Does it need user info?

  4. **Expenses**
     - What info? (id, amount, category...?)
     - Connected to Projects? Tasks? Both?

  5. **Income**
     - What info? (id, amount, source...?)
     - Connected to Projects?

  6. **Tags**
     - Do we need a separate table?
     - Or just store tags as text in tasks?
     - How would you search tasks by tag?

  ## Relationships (Draw it out)

  User -> Projects (how?)
  Project -> Tasks (how?)
  Project -> Expenses (how?)
  Task -> Tags (how?)

  ---
  Your Task

  1. Create database-schema.md
  2. Think through each table and write what columns you think it needs
  3. Think about relationships - use arrows or words like "One User has Many Projects"
  4. Don't Google, don't peek - use your brain first!

  When you're done, tell me. I'll review it, explain what's good, what's missing, and teach you WHY certain
  designs work better.

  This exercise will reveal how you think about data. Then I'll teach you the proper patterns.


created the tables 

   Schema |   Name    | Type  |  Owner
--------+-----------+-------+----------
 public | expenses  | table | postgres
 public | income    | table | postgres
 public | projects  | table | postgres
 public | tags      | table | postgres
 public | task_tags | table | postgres
 public | tasks     | table | postgres
 public | users     | table | postgres
(7 rows)



project_finance_tracker=# \d projects
                                         Table "public.projects"
   Column    |            Type             | Collation | Nullable |               Default
-------------+-----------------------------+-----------+----------+--------------------------------------
 id          | integer                     |           | not null | nextval('projects_id_seq'::regclass)
 user_id     | integer                     |           | not null |
 name        | character varying(255)      |           | not null |
 description | text                        |           |          |
 status      | character varying(50)       |           |          | 'active'::character varying
 created_at  | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 updated_at  | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "projects_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
Referenced by:
    TABLE "expenses" CONSTRAINT "expenses_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    TABLE "income" CONSTRAINT "income_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    TABLE "tasks" CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
