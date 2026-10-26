-- ==============================================================================
-- Voltt Protein Bar E-commerce: Initial Schema & Security Migration
-- Version: 20261009000000_initial_schema.sql
-- ==============================================================================

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  default_address text,
  default_city text,
  default_state text,
  default_pincode text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. User Roles Table (Zero-Trust Privilege Separation)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role text NOT NULL CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index on user_roles for fast lookup
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- 3. Products Table (Exact match to existing Voltt catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id bigint PRIMARY KEY,
  title text NOT NULL,
  event_slug text NOT NULL UNIQUE,
  eyebrow text,
  summary text,
  description text,
  image text NOT NULL,
  price_in_paise integer NOT NULL, -- 6800 paise = ₹68
  sold_out boolean DEFAULT false NOT NULL,
  nutrition_key text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Orders Table (Guest + Customer Checkout Support)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for guest checkout
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_state text NOT NULL,
  shipping_pincode text NOT NULL,
  subtotal_in_paise integer NOT NULL,
  shipping_fee_in_paise integer NOT NULL DEFAULT 0,
  grand_total_in_paise integer NOT NULL,
  payment_status text NOT NULL CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')) DEFAULT 'PENDING',
  fulfillment_status text NOT NULL CHECK (fulfillment_status IN ('UNFULFILLED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'SHIPMENT_FAILED')) DEFAULT 'UNFULFILLED',
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- 5. Order Items Table (Immutable Snapshot of purchased items)
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id bigint REFERENCES public.products(id) ON DELETE SET NULL,
  product_title text NOT NULL,
  pack_size integer NOT NULL DEFAULT 1,
  quantity integer NOT NULL DEFAULT 1,
  unit_price_in_paise integer NOT NULL,
  total_price_in_paise integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 6. Payments Table (Razorpay Transactions)
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  razorpay_order_id text NOT NULL UNIQUE,
  razorpay_payment_id text UNIQUE,
  razorpay_signature text,
  payment_status text NOT NULL CHECK (payment_status IN ('INITIATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED')) DEFAULT 'INITIATED',
  amount_in_paise integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  error_code text,
  error_description text,
  raw_response jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON public.payments(razorpay_payment_id);

-- 7. Shipments Table (Shiprocket Fulfillment)
CREATE TABLE IF NOT EXISTS public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  shiprocket_order_id text,
  shipment_id text,
  awb_code text,
  courier_name text,
  tracking_url text,
  status text NOT NULL CHECK (status IN ('PENDING', 'MANIFESTED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RTO', 'FAILED')) DEFAULT 'PENDING',
  retry_count integer NOT NULL DEFAULT 0,
  raw_response jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_awb_code ON public.shipments(awb_code);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);

-- 8. Webhook Events Table (Duplicate Prevention & Audit Trail)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  provider text NOT NULL CHECK (provider IN ('razorpay', 'shiprocket')),
  payload jsonb NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  error_message text,
  received_at timestamptz DEFAULT now() NOT NULL,
  processed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed);

-- 9. Admin Audit Logs Table (Protected Administrative Actions)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_resource text NOT NULL,
  target_id text,
  changes jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);

-- ==============================================================================
-- Security Helper Functions
-- ==============================================================================

-- Non-recursive is_admin() function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Trigger function to create profile and default customer role on auth.users creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'customer')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Profiles are viewable by owner or admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles can be updated by owner or admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles can be inserted by owner or admin"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- 2. User Roles Policies (Strictly Admin or System-Managed)
CREATE POLICY "User roles viewable by owner or admin"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Only admins can insert user roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update user roles"
  ON public.user_roles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Only admins can delete user roles"
  ON public.user_roles FOR DELETE
  USING (public.is_admin());

-- 3. Products Policies (Public Catalog Read-Only)
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert or modify products"
  ON public.products FOR ALL
  USING (public.is_admin());

-- 4. Orders Policies
CREATE POLICY "Authenticated users can view their own orders; admins can view all"
  ON public.orders FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_admin()
  );

CREATE POLICY "Orders can be inserted by customers, guests, or admins"
  ON public.orders FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
    OR public.is_admin()
  );

CREATE POLICY "Only admins can modify or delete orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- 5. Order Items Policies
CREATE POLICY "Order items viewable by order owner or admin"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
      AND ((o.user_id IS NOT NULL AND o.user_id = auth.uid()) OR public.is_admin())
    )
  );

CREATE POLICY "Order items can be inserted with matching order"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id
      AND (o.user_id = auth.uid() OR o.user_id IS NULL OR public.is_admin())
    )
  );

CREATE POLICY "Only admins can modify order items"
  ON public.order_items FOR ALL
  USING (public.is_admin());

-- 6. Payments Policies (Server/Admin Controlled)
CREATE POLICY "Payments viewable by order owner or admin"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = payments.order_id
      AND ((o.user_id IS NOT NULL AND o.user_id = auth.uid()) OR public.is_admin())
    )
  );

CREATE POLICY "Only admins or server can modify payments"
  ON public.payments FOR ALL
  USING (public.is_admin());

-- 7. Shipments Policies (Server/Admin Controlled)
CREATE POLICY "Shipments viewable by order owner or admin"
  ON public.shipments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = shipments.order_id
      AND ((o.user_id IS NOT NULL AND o.user_id = auth.uid()) OR public.is_admin())
    )
  );

CREATE POLICY "Only admins or server can modify shipments"
  ON public.shipments FOR ALL
  USING (public.is_admin());

-- 8. Webhook Events Policies (Restricted to Admin and Service Role)
CREATE POLICY "Webhook events accessible only by admin"
  ON public.webhook_events FOR ALL
  USING (public.is_admin());

-- 9. Admin Audit Logs Policies (Restricted to Admin and Service Role)
CREATE POLICY "Admin audit logs accessible only by admin"
  ON public.admin_audit_logs FOR ALL
  USING (public.is_admin());

-- ==============================================================================
-- Initial Product Catalog Seed (Exact match to existing products.js)
-- ==============================================================================

INSERT INTO public.products (id, title, event_slug, eyebrow, summary, description, image, price_in_paise, sold_out, nutrition_key)
VALUES
  (
    1,
    'Almond Crunch',
    'almond-crunch',
    'Nutty Clean Fuel',
    'A roasted almond profile with a clean crunch that feels familiar, simple, and satisfying.',
    'Almond Crunch is the steady everyday bar in the lineup, designed for commutes, desk drawers, gym bags, and everything in between.',
    '/assets/almond-crunch.png',
    6800, -- ₹68 / bar
    false,
    'almond'
  ),
  (
    3,
    'Choco Cranz',
    'choco-cranz',
    'Cranberry Cocoa Energy',
    'A bright cranberry twist layered into a rich protein bar for a sharper, fruit-forward bite.',
    'Built for people who want quick fuel without a heavy feel, Choco Cranz balances sweetness, texture, and a fast snackable format.',
    '/assets/choco-cranz.png',
    6800, -- ₹68 / bar
    false,
    'cranberry'
  ),
  (
    2,
    'Berry Rush',
    'berry-rush',
    'Berry-Forward Recovery',
    'A smooth berry-led bar with a lighter profile for people who want something fruity after activity.',
    'Berry Rush keeps the protein base while leaning into a softer, brighter flavour profile that works well before or after training.',
    '/assets/berry-rush.png',
    6800, -- ₹68 / bar
    false,
    'blueberry'
  ),
  (
    4,
    'The Voltt Mixed Box',
    'mixed-flavours',
    'Mixed Flavour Starter',
    'A simple way to try the Voltt range before locking into a favourite flavour.',
    'The mixed-flavours page gives shoppers a flexible entry point when they want to sample the lineup and choose their ideal repeat order later.',
    '/assets/mix.png',
    6800, -- ₹68 / bar base
    false,
    'mix'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  event_slug = EXCLUDED.event_slug,
  eyebrow = EXCLUDED.eyebrow,
  summary = EXCLUDED.summary,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  price_in_paise = EXCLUDED.price_in_paise,
  sold_out = EXCLUDED.sold_out,
  nutrition_key = EXCLUDED.nutrition_key,
  updated_at = now();
