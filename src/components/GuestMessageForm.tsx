'use client';

import React, { useState } from 'react';
import { Invitation, GuestMessage } from '@/lib/types';
import { submitGuestMessage } from '@/lib/rpc';
import { Star } from 'lucide-react';

interface GuestMessageFormProps {
    invitation: Invitation;
    initialMessages: GuestMessage[];
}

export default function GuestMessageForm({ invitation, initialMessages }: GuestMessageFormProps) {
    const [messages, setMessages] = useState<GuestMessage[]>(initialMessages);
    const [wishText, setWishText] = useState('');
    const [loading, setLoading] = useState(false);

    // Check if user has already submitted based on invitation_id
    const [hasSubmitted, setHasSubmitted] = useState(() => {
        return initialMessages.some(msg => msg.invitation_id === invitation.id);
    });

    const handleWishSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wishText.trim()) return;

        setLoading(true);

        // Optimistic update
        const tempId = Math.random().toString();
        const tempMessage: GuestMessage = {
            id: tempId,
            invitation_id: invitation.id,
            guest_name: `${invitation.first_name} ${invitation.last_name}`,
            message_text: wishText,
            created_at: new Date().toISOString()
        };

        setMessages([tempMessage, ...messages]);
        setWishText('');

        const { error } = await submitGuestMessage(invitation.invite_token, tempMessage.message_text);

        if (error) {
            console.error("Failed to send wish:", error);
            // Rollback optimistic update
            setMessages(prev => prev.filter(m => m.id !== tempId));

            if (error.includes('MESSAGE_ALREADY_SUBMITTED')) {
                alert('¡Ya has enviado un mensaje! Solo se permite uno por invitado.');
                setHasSubmitted(true);
            } else {
                alert('Hubo un error al enviar el mensaje. Intenta nuevamente.');
                // Restore text so they can try again
                setWishText(tempMessage.message_text);
            }
        } else {
            setHasSubmitted(true);
        }

        setLoading(false);
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-white to-emerald-50" id="wishes-container">
            <div className="max-w-2xl mx-auto text-center">
                <Star className="w-8 h-8 text-emerald-400 fill-emerald-400 mx-auto mb-4 animate-spin-slow" />
                <h3 className="font-display text-3xl text-slate-800 mb-8">Déjale un deseo a Ruby</h3>

                {!hasSubmitted ? (
                    <form onSubmit={handleWishSubmit} className="relative max-w-md mx-auto mb-10">
                        <input
                            type="text"
                            value={wishText}
                            onChange={(e) => setWishText(e.target.value)}
                            placeholder="Escribe algo bonito... (Máx 100 caracteres)"
                            className="w-full px-6 py-4 rounded-full border-2 border-emerald-200 focus:outline-none focus:border-teal-400 font-body text-sm shadow-sm"
                            maxLength={100}
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading} className="absolute right-2 top-2 bottom-2 bg-teal-500 text-white px-6 rounded-full font-bold text-xs hover:bg-teal-600 transition-colors cursor-pointer disabled:opacity-50">
                            {loading ? '...' : 'ENVIAR'}
                        </button>
                    </form>
                ) : (
                    <div className="mb-10 p-4 bg-emerald-100 text-emerald-700 rounded-xl max-w-md mx-auto">
                        <p className="font-bold text-sm">¡Gracias por tu mensaje!</p>
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-3">
                    {messages.map((wish, idx) => (
                        <div key={`${wish.id}-${idx}`} className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 text-sm font-body text-slate-600 animate-float" style={{ animationDelay: `${idx * 0.5}s` }}>
                            <span className="font-bold text-teal-500">{wish.guest_name}:</span> {wish.message_text}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
