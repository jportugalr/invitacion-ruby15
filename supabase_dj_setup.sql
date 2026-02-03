-- 1) Modify song_requests table
ALTER TABLE public.song_requests 
ADD COLUMN IF NOT EXISTS normalized_text text,
ADD COLUMN IF NOT EXISTS track_title text,
ADD COLUMN IF NOT EXISTS artist text,
ADD COLUMN IF NOT EXISTS external_id text,
ADD COLUMN IF NOT EXISTS provider text DEFAULT 'manual';

CREATE INDEX IF NOT EXISTS idx_song_requests_event_normalized 
ON public.song_requests(event_id, normalized_text);

-- 2) Create song_request_votes table
CREATE TABLE IF NOT EXISTS public.song_request_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid NOT NULL REFERENCES public.events(id),
    guest_id uuid NOT NULL REFERENCES public.guests(id),
    song_request_id uuid NOT NULL REFERENCES public.song_requests(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(event_id, guest_id, song_request_id)
);

-- RLS
ALTER TABLE public.song_request_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_request_votes FORCE ROW LEVEL SECURITY;

-- No policies for anon needed as we use RPC SECURITY DEFINER

-- 3) RPCs

-- A) submit_song_request
CREATE OR REPLACE FUNCTION public.submit_song_request(
    p_invite_token uuid,
    p_query_text text,
    p_provider text DEFAULT 'manual',
    p_external_id text DEFAULT null,
    p_track_title text DEFAULT null,
    p_artist text DEFAULT null
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_event_id uuid;
    v_guest_id uuid;
    v_normalized text;
    v_count integer;
    v_limit integer := 5; -- Configurable limit
    v_new_id uuid;
BEGIN
    -- 1. Get guest & event from token
    SELECT event_id, id INTO v_event_id, v_guest_id
    FROM public.guests
    WHERE invite_token = p_invite_token;

    IF v_guest_id IS NULL THEN
        RAISE EXCEPTION 'INVALID_TOKEN';
    END IF;

    -- 2. Validate input
    IF length(trim(p_query_text)) = 0 THEN
        RAISE EXCEPTION 'QUERY_TEXT_REQUIRED';
    END IF;

    IF length(p_query_text) > 120 THEN
        RAISE EXCEPTION 'QUERY_TEXT_TOO_LONG';
    END IF;

    -- 3. Check limit
    SELECT count(*) INTO v_count
    FROM public.song_requests
    WHERE event_id = v_event_id AND guest_id = v_guest_id;

    IF v_count >= v_limit THEN
        RAISE EXCEPTION 'SUGGESTION_LIMIT_REACHED';
    END IF;

    -- 4. Normalize
    v_normalized := lower(regexp_replace(trim(p_query_text), '\s+', ' ', 'g'));

    -- 5. Insert
    INSERT INTO public.song_requests (
        event_id,
        guest_id,
        query_text,
        normalized_text,
        provider,
        external_id,
        track_title,
        artist,
        status
    ) VALUES (
        v_event_id,
        v_guest_id,
        trim(p_query_text),
        v_normalized,
        p_provider,
        p_external_id,
        p_track_title,
        p_artist,
        'pending'
    ) RETURNING id INTO v_new_id;

    RETURN json_build_object('success', true, 'id', v_new_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_song_request TO anon, authenticated, service_role;


-- B) list_song_requests
CREATE OR REPLACE FUNCTION public.list_song_requests(p_invite_token uuid)
RETURNS TABLE (
    song_request_id uuid,
    query_text text,
    track_title text,
    artist text,
    guest_name text,
    created_at timestamptz,
    votes_count bigint,
    i_voted boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_event_id uuid;
    v_guest_id uuid;
BEGIN
    -- Get context
    SELECT event_id, id INTO v_event_id, v_guest_id
    FROM public.guests
    WHERE invite_token = p_invite_token;

    IF v_guest_id IS NULL THEN
        RAISE EXCEPTION 'INVALID_TOKEN';
    END IF;

    RETURN QUERY
    SELECT 
        sr.id as song_request_id,
        sr.query_text,
        sr.track_title,
        sr.artist,
        -- Format name: "First N."
        (g.first_name || ' ' || left(g.last_name, 1) || '.') as guest_name,
        sr.created_at,
        (SELECT count(*) FROM public.song_request_votes srv WHERE srv.song_request_id = sr.id) as votes_count,
        (EXISTS (SELECT 1 FROM public.song_request_votes srv WHERE srv.song_request_id = sr.id AND srv.guest_id = v_guest_id)) as i_voted
    FROM public.song_requests sr
    JOIN public.guests g ON sr.guest_id = g.id
    WHERE sr.event_id = v_event_id
    ORDER BY votes_count DESC, sr.created_at DESC
    LIMIT 200;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_song_requests TO anon, authenticated, service_role;


-- C) vote_song_request
CREATE OR REPLACE FUNCTION public.vote_song_request(
    p_invite_token uuid,
    p_song_request_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_event_id uuid;
    v_guest_id uuid;
    v_request_event_id uuid;
BEGIN
    -- 1. Auth check
    SELECT event_id, id INTO v_event_id, v_guest_id
    FROM public.guests
    WHERE invite_token = p_invite_token;

    IF v_guest_id IS NULL THEN
        RAISE EXCEPTION 'INVALID_TOKEN';
    END IF;

    -- 2. Verify request belongs to same event
    SELECT event_id INTO v_request_event_id
    FROM public.song_requests
    WHERE id = p_song_request_id;

    IF v_request_event_id IS NULL OR v_request_event_id != v_event_id THEN
         RAISE EXCEPTION 'INVALID_REQUEST_ID';
    END IF;

    -- 3. Insert vote
    BEGIN
        INSERT INTO public.song_request_votes (event_id, guest_id, song_request_id)
        VALUES (v_event_id, v_guest_id, p_song_request_id);
    EXCEPTION WHEN unique_violation THEN
        RAISE EXCEPTION 'ALREADY_VOTED';
    END;

    RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.vote_song_request TO anon, authenticated, service_role;
