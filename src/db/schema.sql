-- Winter Arc Habit Tracker Database Schema

-- Habits table: stores the list of daily habits
CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Habit logs: daily completion status for each habit
CREATE TABLE IF NOT EXISTS habit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  habit_id INTEGER NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD format
  completed BOOLEAN NOT NULL DEFAULT 0,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
  UNIQUE(habit_id, date)
);

-- Reminders: notification settings
CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  time TEXT NOT NULL, -- HH:MM format
  enabled BOOLEAN NOT NULL DEFAULT 1,
  days_of_week TEXT NOT NULL DEFAULT '0,1,2,3,4,5,6', -- comma-separated
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);

-- Insert default habits
INSERT OR IGNORE INTO habits (id, title, description, order_index) VALUES
  (1, 'Hit 200g+ protein', 'Track daily protein intake', 1),
  (2, 'Bank 500+ cal deficit', 'Maintain calorie deficit for weight loss', 2),
  (3, 'Weigh-in logged', 'Record morning weight', 3),
  (4, 'Resistance or cardio training done', 'Complete workout session', 4),
  (5, 'All meals logged', 'Track all food consumed', 5),
  (6, 'Sleep >7hrs', 'Get adequate rest', 6),
  (7, 'Injury check-in', 'Monitor body condition', 7),
  (8, 'Tomorrow''s food prep confirmed', 'Plan next day meals', 8),
  (9, 'Fruit budget system executed', 'Follow fruit consumption plan', 9),
  (10, 'Cafeteria discipline', 'Stick to planned meals when eating out', 10),
  (11, 'Social meal check-in', 'Track social eating situations', 11);

-- Insert default reminders
INSERT OR IGNORE INTO reminders (id, title, time, enabled) VALUES
  (1, 'Morning Check-in', '08:00', 1),
  (2, 'Evening Review', '21:00', 1);
