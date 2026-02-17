import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if president already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, username')
      .eq('username', 'usc.president_ix')
      .maybeSingle();

    if (existingProfile) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'President account already exists',
          username: 'usc.president_ix',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Create president user with Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'usc.president_ix@miaoda.com',
      password: 'presidential.login_uscix',
      email_confirm: true,
      user_metadata: {
        username: 'usc.president_ix',
        full_name: 'USC IX President',
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    // Update profile to set role as president
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        role: 'president',
        full_name: 'USC IX President',
      })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'President account created successfully',
        username: 'usc.president_ix',
        password: 'presidential.login_uscix',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
