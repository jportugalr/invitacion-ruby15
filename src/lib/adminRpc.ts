import { supabase } from './supabase';
import { AdminInvitation, RpcResponse } from './types';

export async function adminListInvitations(eventId: string): Promise<RpcResponse<AdminInvitation[]>> {
    try {
        const { data, error } = await supabase.rpc('admin_list_invitations', {
            p_event_id: eventId
        });

        if (error) {
            return { data: null, error: error.message };
        }
        return { data: data as AdminInvitation[], error: null };
    } catch (err: any) {
        return { data: null, error: 'Failed to list invitations' };
    }
}

export async function adminUpdateGuestPhone(guestId: string, phone: string): Promise<RpcResponse<boolean>> {
    try {
        const { error } = await supabase.rpc('admin_update_guest_phone', {
            p_guest_id: guestId,
            p_phone_e164: phone
        });

        if (error) {
            return { data: null, error: error.message };
        }
        return { data: true, error: null };
    } catch (err: any) {
        return { data: null, error: 'Failed to update phone' };
    }
}

export async function adminMarkInvitationSent(
    guestId: string,
    phone: string,
    inviteUrl: string,
    template: string
): Promise<RpcResponse<boolean>> {
    try {
        const { error } = await supabase.rpc('admin_mark_invitation_sent', {
            p_guest_id: guestId,
            p_phone_e164: phone,
            p_invite_url: inviteUrl,
            p_message_template: template
        });

        if (error) {
            return { data: null, error: error.message };
        }
        return { data: true, error: null };
    } catch (err: any) {
        return { data: null, error: 'Failed to mark as sent' };
    }
}
