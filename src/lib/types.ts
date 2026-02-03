export type InvitationStatus = 'pending' | 'confirmed' | 'declined';

export interface Invitation {
    id: string; // uuid
    invite_token: string; // uuid
    first_name: string;
    last_name: string;
    plus_one_allowed: boolean;
    rsvp_status: InvitationStatus;
    attendees_count: number;
    companion_name: string | null;
    notes: string | null;
    created_at: string;
}

export interface GuestMessage {
    id: string; // uuid
    invitation_id: string; // uuid
    guest_name: string; // from invitation.first_name + last_name usually
    message_text: string;
    created_at: string;
}

export interface SongRequest {
    song_request_id: string; // uuid
    query_text: string;
    track_title?: string;
    artist?: string;
    guest_name: string; // Shortened name (e.g. "Carlos R.")
    created_at: string;
    votes_count: number;
    i_voted: boolean;
}

export interface RpcResponse<T> {
    data: T | null;
    error: string | null;
}
