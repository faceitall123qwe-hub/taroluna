// RevenueCat -> Supabase. Set REVENUECAT_WEBHOOK_SECRET as a function secret and use the same
// value as the Authorization header in RevenueCat (Project settings -> Integrations -> Webhooks).
import { createClient } from 'npm:@supabase/supabase-js@2';

const secret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  if (!secret || req.headers.get('Authorization') !== `Bearer ${secret}`) {
    return new Response('unauthorized', { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.event?.id) {
    return new Response('bad request', { status: 400 });
  }
  const { data, error } = await supabase.rpc('apply_revenuecat_event', { p_event: body.event });
  if (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });  // RevenueCat retries on 5xx
  }
  return new Response(JSON.stringify({ result: data }), { headers: { 'Content-Type': 'application/json' } });
});
