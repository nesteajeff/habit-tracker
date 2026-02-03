-- Postgres schema for the habit tracker.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE habits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE habit_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (habit_id, entry_date)
);

CREATE TABLE goals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  target_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status IN ('active', 'paused', 'completed'))
);

CREATE INDEX habits_user_id_idx ON habits(user_id);
CREATE INDEX habit_entries_habit_id_idx ON habit_entries(habit_id);
CREATE INDEX goals_user_id_idx ON goals(user_id);
