import { supabase } from './supabase';
import { Invitation, GuestMessage, SongRequest, RpcResponse } from './types';

/**
 * Fetch invitation details by token
 */
export async function getInvitation(inviteToken: string): Promise<RpcResponse<Invitation>> {
    try {
        const { data, error } = await supabase
            .rpc('get_invitation', { p_invite_token: inviteToken })
            .single();

        if (error) {
            console.error('Error fetching invitation:', JSON.stringify(error, null, 2));
            return { data: null, error: error.message };
        }

        return { data: data as Invitation, error: null };
    } catch (err: any) {
        console.error('Unexpected error in getInvitation:', err);
        return { data: null, error: 'Unexpected error occurred.' };
    }
}

/**
 * Submit RSVP for an invitation
 */
/**
 * Submit RSVP for an invitation
 */
export async function submitRsvp(
    inviteToken: string,
    status: 'confirmed' | 'declined',
    attendeesCount: number,
    companionName: string | null,
    notes: string | null
): Promise<RpcResponse<boolean>> {
    try {
        const { data, error } = await supabase.rpc('submit_rsvp', {
            p_invite_token: inviteToken,
            p_rsvp_status: status,
            p_attendees_count: attendeesCount,
            p_companion_name: companionName,
            p_notes: notes
        });

        if (error) {
            console.error('RSVP Error:', JSON.stringify(error, null, 2));
            return { data: null, error: error.message };
        }

        return { data: true, error: null };
    } catch (err: any) {
        console.error('Unexpected RSVP Error:', err);
        return { data: null, error: 'Failed to submit RSVP.' };
    }
}

/**
 * Submit a guest message
 */
export async function submitGuestMessage(
    inviteToken: string,
    messageText: string
): Promise<RpcResponse<boolean>> {
    try {
        const { data, error } = await supabase.rpc('submit_guest_message', {
            p_invite_token: inviteToken,
            p_message_text: messageText,
        });

        if (error) {
            return { data: null, error: error.message };
        }

        return { data: true, error: null };
    } catch (err: any) {
        return { data: null, error: 'Failed to send message.' };
    }
}

/**
 * Get all guest messages for the event (filtered by backend logic usually, or just public ones)
 * The RPC signature in request was `get_guest_messages(p_invite_token)` which implies 
 * it might verify the viewer has access, or it's public for that event.
 */
export async function getGuestMessages(inviteToken: string): Promise<RpcResponse<GuestMessage[]>> {
    try {
        const { data, error } = await supabase
            .rpc('get_guest_messages', { p_invite_token: inviteToken });

        if (error) {
            return { data: null, error: error.message };
        }

        return { data: data as GuestMessage[], error: null };
    } catch (err: any) {
        return { data: null, error: 'Failed to load messages.' };
    }
}

/**
 * Collaborative DJ RPCs
 */

export async function submitSongRequest(
    inviteToken: string,
    queryText: string
): Promise<RpcResponse<boolean>> {
    try {
        const { error } = await supabase.rpc('submit_song_request', {
            p_invite_token: inviteToken,
            p_query_text: queryText
        });

        if (error) {
            console.error('Submit Song Error:', error);
            return { data: null, error: error.message };
        }
        return { data: true, error: null };
    } catch (err: any) {
        return { data: null, error: 'Failed to submit song.' };
    }
}

export async function listSongRequests(inviteToken: string): Promise<RpcResponse<SongRequest[]>> {
    try {
        const { data, error } = await supabase.rpc('list_song_requests', {
            p_invite_token: inviteToken
        });

        if (error) {
            console.error('List Songs Error:', error);
            return { data: null, error: error.message };
        }
        return { data: data as SongRequest[], error: null };
    } catch (err: any) {
        return { data: null, error: 'Failed to list songs.' };
    }
}

export async function voteSongRequest(
    inviteToken: string,
    requestId: string
): Promise<RpcResponse<boolean>> {
    try {
        const { error } = await supabase.rpc('vote_song_request', {
            p_invite_token: inviteToken,
            p_song_request_id: requestId
        });

        if (error) {
            return { data: null, error: error.message };
        }
        return { data: true, error: null };
    } catch (err: any) {
        return { data: null, error: 'Failed to vote.' };
    }
}
