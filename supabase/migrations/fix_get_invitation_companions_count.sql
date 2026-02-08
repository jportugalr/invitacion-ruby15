-- Verificar y actualizar el RPC get_invitation para incluir companions_count
-- Este script actualiza la función para asegurar que devuelve el campo companions_count

CREATE OR REPLACE FUNCTION get_invitation(p_invite_token UUID)
RETURNS TABLE (
    id UUID,
    invite_token UUID,
    first_name TEXT,
    last_name TEXT,
    plus_one_allowed BOOLEAN,
    companions_count SMALLINT,  -- ← IMPORTANTE: Este campo debe estar aquí
    rsvp_status TEXT,
    attendees_count INTEGER,
    companion_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,
        g.invite_token,
        g.first_name,
        g.last_name,
        g.plus_one_allowed,
        g.companions_count,  -- ← IMPORTANTE: Asegúrate de seleccionar este campo
        g.rsvp_status,
        g.attendees_count,
        g.companion_name,
        g.notes,
        g.created_at
    FROM guests g
    WHERE g.invite_token = p_invite_token;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'INVITATION_NOT_FOUND';
    END IF;
END;
$$;
