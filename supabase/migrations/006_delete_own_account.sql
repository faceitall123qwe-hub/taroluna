-- Google Play / App Store require in-app account deletion.
-- Deleting the auth user cascades to profiles -> readings -> reading_cards and subscriptions.
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  DELETE FROM auth.users WHERE id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;
