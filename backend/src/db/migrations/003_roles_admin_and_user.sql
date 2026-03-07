-- Admins: add role (super_admin | admin | sub_admin)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admins' AND column_name = 'role') THEN
    ALTER TABLE admins ADD COLUMN role VARCHAR(40) NOT NULL DEFAULT 'admin';
    CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
  END IF;
END $$;

-- Set default super_admin for the primary admin
UPDATE admins SET role = 'super_admin' WHERE email = 'pashamrevanth541@gmail.com';

-- Users (storefront): add role (customer | candidate) for clear separation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role VARCHAR(40) NOT NULL DEFAULT 'customer';
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  END IF;
END $$;
