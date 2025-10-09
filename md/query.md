SELECT i.*, p.name as project_name, 'income' as type
  FROM income i
  JOIN projects p ON i.project_id = p.id
  WHERE i.project_id = ANY($1)
  ORDER BY i.date DESC
  LIMIT 5

  ---
  Line by Line:

  1. SELECT i.*, p.name as project_name, 'income' as type

  - i.* = Get ALL columns from income table (id, amount, source, description, date, etc.)
  - p.name as project_name = Get the name column from projects table, rename it to project_name
  - 'income' as type = Add a hardcoded column called type with value 'income' (helps us identify this is income, not expense)

  Why? We want income data + the project name + label it as "income"

  ---
  2. FROM income i

  - income = The main table we're querying
  - i = Alias (shortcut name) for income table
  - So instead of writing income.amount, we can write i.amount

  Think of it like: const i = income (giving it a shorter variable name)

  ---
  3. JOIN projects p ON i.project_id = p.id

  - JOIN projects = Combine data from projects table
  - p = Alias for projects table
  - ON i.project_id = p.id = Match condition

  What this does:
  income table          projects table
  -----------           --------------
  project_id: 5    →    id: 5, name: "Website"
  project_id: 7    →    id: 7, name: "App"

  It connects income records to their project names!

  Why? Income table only stores project_id (just a number). We want the project NAME to show in the dashboard.

  ---
  4. WHERE i.project_id = ANY($1)

  - $1 = First parameter passed to the query (which is [projectIds] array)
  - ANY($1) = Match if project_id is in the array

  Example:
  If projectIds = [5, 7, 9], this finds all income where project_id is 5, 7, OR 9.

  Why? We only want income from the logged-in user's projects, not ALL income in the database!

  ---
  5. ORDER BY i.date DESC

  - ORDER BY = Sort the results
  - i.date = Sort by the date column from income table
  - DESC = Descending (newest first)

  Example:
  2025-10-09 ← First (newest)
  2025-10-07
  2025-10-01 ← Last (oldest)

  ---
  6. LIMIT 5

  - Only return 5 results (top 5 most recent)

  ---
  Full Example Result:

  If you have this data:

  income table:
  | id  | project_id | amount | source  | date       |
  |-----|------------|--------|---------|------------|
  | 1   | 5          | 5000   | Client  | 2025-10-09 |
  | 2   | 7          | 3000   | Bonus   | 2025-10-07 |
  | 3   | 5          | 2000   | Payment | 2025-10-05 |

  projects table:
  | id  | name    |
  |-----|---------|
  | 5   | Website |
  | 7   | App     |

  The query returns:
  [
    {
      "id": 1,
      "project_id": 5,
      "amount": 5000,
      "source": "Client",
      "date": "2025-10-09",
      "project_name": "Website",  // ← Added from JOIN
      "type": "income"             // ← Added from SELECT
    },
    {
      "id": 2,
      "project_id": 7,
      "amount": 3000,
      "source": "Bonus",
      "date": "2025-10-07",
      "project_name": "App",
      "type": "income"
    },
    // ... up to 5 results
  ]

  ---
  Why do we need JOIN?

  Without JOIN:
  { "amount": 5000, "project_id": 5 }  // Just a number - not helpful!

  With JOIN:
  { "amount": 5000, "project_name": "Website" }  // Much better for UI!

  ---
  Does this make sense now?
