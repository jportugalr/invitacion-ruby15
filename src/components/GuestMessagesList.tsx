import React from 'react';
import { GuestMessage } from '@/lib/types';

interface GuestMessagesListProps {
    messages: GuestMessage[];
}

export default function GuestMessagesList({ messages }: GuestMessagesListProps) {
    if (messages.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Aún no hay mensajes. ¡Sé el primero en escribir uno!
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-8">
            <h3 className="text-2xl font-serif text-center text-gray-800 mb-6">Mensajes de Cariño</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {messages.map((msg) => (
                    <div key={msg.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-50">
                        <p className="text-gray-700 italic mb-3">"{msg.message_text}"</p>
                        <div className="text-right">
                            <span className="text-sm font-semibold text-pink-600">- {msg.author_name}</span>
                            <p className="text-xs text-gray-400">
                                {new Date(msg.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
