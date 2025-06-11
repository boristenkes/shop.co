BEGIN;

-- 1) Add new UUID columns
ALTER TABLE users              ADD COLUMN new_id UUID;
ALTER TABLE products           ADD COLUMN new_user_id UUID;
ALTER TABLE reviews            ADD COLUMN new_user_id UUID;
ALTER TABLE orders             ADD COLUMN new_user_id UUID;
ALTER TABLE carts              ADD COLUMN new_user_id UUID;
ALTER TABLE coupons            ADD COLUMN new_user_id UUID;
ALTER TABLE accounts           ADD COLUMN new_user_id UUID;
ALTER TABLE sessions           ADD COLUMN new_user_id UUID;
ALTER TABLE authenticators     ADD COLUMN new_user_id UUID;

-- 2) Backfill users.new_id
UPDATE users SET new_id = gen_random_uuid();

-- 3) Propagate to child tables
UPDATE products        p SET new_user_id = u.new_id FROM users u WHERE p.user_id = u.id;
UPDATE reviews         r SET new_user_id = u.new_id FROM users u WHERE r.user_id = u.id;
UPDATE orders          o SET new_user_id = u.new_id FROM users u WHERE o.user_id = u.id;
UPDATE carts           c SET new_user_id = u.new_id FROM users u WHERE c.user_id = u.id;
UPDATE coupons         cp SET new_user_id = u.new_id FROM users u WHERE cp.user_id = u.id;
UPDATE accounts        a SET new_user_id = u.new_id FROM users u WHERE a.user_id = u.id;
UPDATE sessions        s SET new_user_id = u.new_id FROM users u WHERE s.user_id = u.id;
UPDATE authenticators  t SET new_user_id = u.new_id FROM users u WHERE t.user_id = u.id;

-- 4) Drop existing FK constraints
ALTER TABLE products       DROP CONSTRAINT IF EXISTS products_user_id_fkey;
ALTER TABLE reviews        DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE orders         DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE carts          DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
ALTER TABLE coupons        DROP CONSTRAINT IF EXISTS coupons_user_id_fkey;
ALTER TABLE accounts       DROP CONSTRAINT IF EXISTS accounts_user_id_fkey;
ALTER TABLE sessions       DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE authenticators DROP CONSTRAINT IF EXISTS authenticators_user_id_fkey;

-- 5) Replace users.id with new_id
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE users DROP COLUMN id;
ALTER TABLE users RENAME COLUMN new_id TO id;
ALTER TABLE users ADD PRIMARY KEY (id);

-- 6) Replace user_id in child tables
-- Products
ALTER TABLE products DROP COLUMN user_id;
ALTER TABLE products RENAME COLUMN new_user_id TO user_id;

-- Reviews
ALTER TABLE reviews DROP COLUMN user_id;
ALTER TABLE reviews RENAME COLUMN new_user_id TO user_id;

-- Orders
ALTER TABLE orders DROP COLUMN user_id;
ALTER TABLE orders RENAME COLUMN new_user_id TO user_id;

-- Carts
ALTER TABLE carts DROP COLUMN user_id;
ALTER TABLE carts RENAME COLUMN new_user_id TO user_id;

-- Coupons
ALTER TABLE coupons DROP COLUMN user_id;
ALTER TABLE coupons RENAME COLUMN new_user_id TO user_id;

-- Accounts
ALTER TABLE accounts DROP COLUMN user_id;
ALTER TABLE accounts RENAME COLUMN new_user_id TO user_id;

-- Sessions
ALTER TABLE sessions DROP COLUMN user_id;
ALTER TABLE sessions RENAME COLUMN new_user_id TO user_id;

-- Authenticators
ALTER TABLE authenticators DROP COLUMN user_id;
ALTER TABLE authenticators RENAME COLUMN new_user_id TO user_id;

-- 7) Recreate FK constraints
ALTER TABLE products       ADD CONSTRAINT products_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE reviews        ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE orders         ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE carts          ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE coupons        ADD CONSTRAINT coupons_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE accounts       ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE sessions       ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE authenticators ADD CONSTRAINT authenticators_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);

COMMIT;
