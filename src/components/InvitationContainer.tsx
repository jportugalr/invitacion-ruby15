'use client';

import React, { useState } from 'react';
import Envelope from '@/components/Envelope';
import { Invitation } from '@/lib/types';

interface InvitationContainerProps {
    children: React.ReactNode;
    invitation: Invitation;
}

export default function InvitationContainer({ children, invitation }: InvitationContainerProps) {
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

    const handleOpen = () => {
        setIsEnvelopeOpen(true);
    };

    const guestName = `${invitation.first_name} ${invitation.last_name}`;

    return (
        <>
            {/* The Envelope works as an overlay. When opened, it slides up and reveals the content underneath. */}
            <Envelope guestName={guestName} onOpen={handleOpen} />

            {/* Main Content Area */}
            {/* We apply a transition to the main content for a smooth reveal if needed, 
                or just let the Envelope slide up to reveal it z-index style. 
                Based on the user's snippet, they used opacity transition. 
            */}
            <div className={`transition-opacity duration-1000 ${isEnvelopeOpen ? 'opacity-100' : 'opacity-0'}`}>
                {children}
            </div>
        </>
    );
}
