-- Run once in the Supabase SQL editor (same project as the founders app).
-- Removes the problem_statement_url column and its data from case_entries.
-- The app code no longer reads or writes this column.

alter table case_entries
  drop column if exists problem_statement_url;
