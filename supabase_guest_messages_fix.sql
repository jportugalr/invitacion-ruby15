-- Redefine get_guest_messages to match new frontend logic
CREATE OR REPLACE FUNCTION public.get_guest_messages(p_invite_token uuid)
RETURNS TABLE (
    id uuid,
    invitation_id uuid,
    guest_name text,
    message_text text,
    created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_event_id uuid;
BEGIN
    -- Get event_id from token
    SELECT event_id INTO v_event_id
    FROM public.guests
    WHERE invite_token = p_invite_token;

    RETURN QUERY
    SELECT 
        gm.id,
        gm.invitation_id,
        -- Ensure we return a name. Use guest data if author_name is null in message table
        COALESCE(gm.author_name, (g.first_name || ' ' || g.last_name)) as guest_name,
        gm.message_text,
        gm.created_at
    FROM public.guest_messages gm
    LEFT JOIN public.guests g ON gm.invitation_id = g.id
    WHERE gm.event_id = v_event_id
    ORDER BY gm.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_guest_messages TO anon, authenticated, service_role;
