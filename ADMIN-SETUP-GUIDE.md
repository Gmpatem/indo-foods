# 🔐 ADMIN ACCOUNT SETUP GUIDE

## STEP 1: RUN SQL IN SUPABASE

1. Go to: https://supabase.com/dashboard
2. Select your Indo Foods project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste this SQL:
```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Only admins can manage all profiles
CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

6. Click **RUN** button

---

## STEP 2: CREATE YOUR ADMIN ACCOUNT

### Option A: Using Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your email (e.g., `admin@indofoods.com`)
4. Enter a password (save it!)
5. Click **Create user**

### Option B: Using Your App

1. Visit: `http://localhost:3000/auth/login`
2. Click "Sign Up" if there's a sign-up option
3. OR modify the login page to have a signup form

---

## STEP 3: PROMOTE YOURSELF TO ADMIN

1. Go back to **SQL Editor** in Supabase
2. Run this query (replace with YOUR email):
```sql
-- Check if profile exists
SELECT * FROM profiles WHERE email = 'your-email@example.com';

-- If exists, update role to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify it worked
SELECT * FROM profiles WHERE role = 'admin';
```

---

## STEP 4: TEST LOGIN

1. Visit: `http://localhost:3000/auth/login`
2. Enter your email and password
3. Click **Sign In**
4. Should redirect to `/admin` dashboard

---

## 🚨 TROUBLESHOOTING

**"Profile doesn't exist"**
- The trigger should auto-create it
- If not, manually create:
```sql
INSERT INTO profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'your-email@example.com';
```

**"Invalid credentials"**
- Check email/password in Supabase → Authentication → Users
- Reset password if needed

**"Access denied"**
- Check role is 'admin':
```sql
SELECT email, role FROM profiles WHERE email = 'your-email@example.com';
```

---

## 📋 QUICK REFERENCE

**Your Credentials:**
- Email: ________________
- Password: ________________
- Role: admin

**URLs:**
- Login: http://localhost:3000/auth/login
- Admin: http://localhost:3000/admin
- Dev Portal: http://localhost:3000/dev-portal

---

## 🔑 ALTERNATIVE: SIGNUP PAGE

If you want a signup page, I can create one that:
1. Creates Supabase account
2. Auto-creates profile
3. You manually promote to admin after

Would you like me to create a signup page?
