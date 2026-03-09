// =========================================================
// SUPABASE DATABASE CONFIGURATION
// =========================================================

// ✏️ Replace these with your actual Supabase project details
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Example of how we will fetch global orders for the Admin
 */
async function fetchGlobalOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return data;
}
