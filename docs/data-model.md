## Data Model (V0)

This is the set of tables needed for the habit/goal tracker.

### Entities

- `users`
- `habits`
- `habit_entries`
- `goals`

### Relationships

- A user has many habits
- A habit has many habit_entries
- A user has many goals

### Tables and fields

#### `users`

- `id` (uuid, PK)
- `email` (text, unique, not null)
- `password_hash` (text, not null)
- `created_at` (timestamptz, not null, default now())

#### `habits`

- `id` (uuid, PK)
- `user_id` (uuid, FK -> users.id, not null)
- `name` (text, not null)
- `description` (text, nullable)
- `is_active` (boolean, not null, default true)
- `created_at` (timestamptz, not null, default now())

#### `habit_entries`

- `id` (uuid, PK)
- `habit_id` (uuid, FK -> habits.id, not null)
- `entry_date` (date, not null) -- one row per day per habit
- `created_at` (timestamptz, not null, default now())

#### `goals`

- `id` (uuid, PK)
- `user_id` (uuid, FK -> users.id, not null)
- `title` (text, not null)
- `target_date` (date, nullable)
- `status` (text, not null, default 'active') -- simple string enum
- `created_at` (timestamptz, not null, default now())

### Notes

- We keep `habit_entries` as the daily check-in log.
- Streaks are derived from `habit_entries` and do not need a stored column.
- `goals.status` stays simple: `active`, `paused`, `completed`.
