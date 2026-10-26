-- ==============================================================================
-- Voltt Protein Bar E-commerce: Security Hardening Migration
-- Version: 20261011000000_restrict_order_insertion.sql
-- Description: Restrict direct client-side insertion on orders and order_items.
-- All legitimate order creation is performed by trusted serverless API routes
-- using the Supabase Service Role key (which bypasses RLS) or by verified admins.
-- ==============================================================================

-- 1. Drop overly permissive client INSERT policy on orders
DROP POLICY IF EXISTS "Orders can be inserted by customers, guests, or admins" ON public.orders;

-- 2. Restrict INSERT on orders strictly to admins (Service Role automatically bypasses RLS)
CREATE POLICY "Only admins or service role can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (public.is_admin());

-- 3. Drop overly permissive client INSERT policy on order_items
DROP POLICY IF EXISTS "Order items can be inserted with matching order" ON public.order_items;

-- 4. Restrict INSERT on order_items strictly to admins (Service Role automatically bypasses RLS)
CREATE POLICY "Only admins or service role can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (public.is_admin());

-- 5. Revoke direct client write permissions (defense in depth)
-- Customers and guests may only SELECT orders (filtered by auth.uid() = user_id via existing RLS)
REVOKE INSERT, UPDATE, DELETE ON public.orders FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.order_items FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.payments FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.shipments FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.admin_audit_logs FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.webhook_events FROM anon, authenticated;

-- Ensure SELECT permissions remain intact for RLS enforcement
GRANT SELECT ON public.orders TO anon, authenticated;
GRANT SELECT ON public.order_items TO anon, authenticated;
GRANT SELECT ON public.payments TO anon, authenticated;
GRANT SELECT ON public.shipments TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
