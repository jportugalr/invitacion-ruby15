import React from 'react';
import { notFound } from 'next/navigation';
import { getInvitation, getGuestMessages } from '@/lib/rpc';

import InvitationContainer from '@/components/InvitationContainer';
import MusicPlayer from '@/components/MusicPlayer';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import EventInfo from '@/components/EventInfo';
import DJSection from '@/components/DJSection';
import GuestMessageForm from '@/components/GuestMessageForm';
import RSVPForm from '@/components/RSVPForm';

// Next.js 15/16 params are async
type Props = {
    params: Promise<{ token: string }>;
};

export const dynamic = 'force-dynamic';

export default async function InvitationPage({ params }: Props) {
    const { token } = await params;

    // Parallel data fetching
    const [invitationRes, messagesRes] = await Promise.all([
        getInvitation(token),
        getGuestMessages(token)
    ]);

    if (invitationRes.error || !invitationRes.data) {
        console.error('Error loading invitation:', invitationRes.error);
        notFound();
    }

    const invitation = { ...invitationRes.data!, invite_token: token };
    const messages = messagesRes.data || [];

    return (
        <main className="min-h-screen">
            <InvitationContainer invitation={invitation}>
                <MusicPlayer />

                <Hero invitation={invitation} />

                {process.env.NEXT_PUBLIC_SHOW_PHOTOS === 'true' && <Timeline />}

                <EventInfo />

                <DJSection invitation={invitation} />

                <GuestMessageForm invitation={invitation} initialMessages={messages} />

                <RSVPForm invitation={invitation} />

                <footer className="bg-slate-950 py-8 text-center">
                    <p className="font-script text-3xl text-slate-600 mb-2">Ruby Zavaleta</p>
                    <p className="text-[10px] text-slate-700 uppercase tracking-widest">Trujillo 2026 • Designed with Love</p>
                </footer>
            </InvitationContainer>
        </main>
    );
}
