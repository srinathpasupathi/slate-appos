

# Create Dummy Tables to Test Lovable Cloud

This plan creates two simple dummy tables in your Lovable Cloud backend purely for testing and exploring Cloud usage costs.

## What will be created

### Table 1: `test_products`
A simple products table with columns:
- `id` (auto-generated unique identifier)
- `name` (text)
- `price` (number)
- `created_at` (timestamp)

### Table 2: `test_tasks`
A simple tasks table with columns:
- `id` (auto-generated unique identifier)
- `title` (text)
- `status` (text, defaults to "pending")
- `created_at` (timestamp)

## Steps
1. Run a single database migration to create both tables
2. Insert a few sample rows into each table so they have some data

## Important notes
- These tables are completely independent from your app -- no code changes needed
- Row Level Security (RLS) will be enabled but with open read policies since these are just test tables
- You can delete these tables anytime later when done testing
- Lovable Cloud pricing is usage-based, so having empty/small tables costs very little

