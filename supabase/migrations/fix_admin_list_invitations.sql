-- Actualizar el RPC admin_list_invitations para incluir companions_count
-- Este script permite que el panel de administración vea cuántos acompañantes adicionales tiene permitido cada invitado.

CREATE OR REPLACE FUNCTION admin_list_invitations(p_event_id UUID)
RETURNS TABLE (
    guest_id UUID,
    first_name TEXT,
    last_name TEXT,
    invite_token UUID,
    plus_one_allowed BOOLEAN,
    companions_count SMALLINT, -- ← NUEVO CAMPO
    attendees_count INTEGER,
    rsvp_status TEXT,
    phone_e164 TEXT,
    last_sent_at TIMESTAMPTZ,
    last_sent_phone TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id as guest_id,
        g.first_name,
        g.last_name,
        g.invite_token,
        g.plus_one_allowed,
        g.companions_count, -- ← SELECCIONAR NUEVO CAMPO
        g.attendees_count,
        g.rsvp_status,
        g.phone_e164,
        g.last_sent_at,
        g.last_sent_phone
    FROM guests g
    WHERE g.event_id = p_event_id
    ORDER BY g.first_name ASC;
END;
$$;
