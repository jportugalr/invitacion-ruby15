
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables in .env');
    process.exit(1);
}

console.log(`Testing connection to: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        // Attempt to call a known RPC or just checking health if possible.
        // Since we only have RPCs, let's try to call one with an invalid token and expect a specific error or empty result,
        // which proves we hit the Supabase instance.
        const { data, error } = await supabase.rpc('get_invitation', { p_invite_token: '00000000-0000-0000-0000-000000000000' });

        if (error) {
            // specific error code usually means connection worked but logic denied (which is good for auth check)
            console.log('✅ Connection Successful (RPC responded):', error.message);
        } else {
            console.log('✅ Connection Successful (Data received):', data);
        }
    } catch (err) {
        console.error('❌ Connection Failed:', err);
    }
}

testConnection();
