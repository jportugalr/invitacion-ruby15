'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function DemoPage() {
    const [token, setToken] = useState('');
    const router = useRouter();

    const handleOpen = (e: React.FormEvent) => {
        e.preventDefault();
        if (token.trim()) {
            router.push(`/i/${token.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                <div className="inline-block p-4 bg-emerald-50 rounded-full mb-6">
                    <Sparkles className="w-8 h-8 text-emerald-500" />
                </div>

                <h1 className="font-display text-3xl text-slate-800 mb-2">Simulador de Invitación</h1>
                <p className="text-slate-500 mb-8 text-sm">Ingresa un UUID válido de la base de datos para previsualizar la invitación.</p>

                <form onSubmit={handleOpen} className="space-y-4">
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Pegar Invite Token (UUID)"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-sm text-center"
                        required
                    />

                    <button
                        type="submit"
                        disabled={!token.trim()}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ABRIR INVITACIÓN
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-left text-xs text-slate-400 space-y-2">
                    <p className="font-bold text-slate-500 uppercase tracking-wider mb-2">Casos de Prueba:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Token Inválido:</strong> Debería mostrar 404.</li>
                        <li><strong>Con +1 (attendees_allowed=2):</strong> Prueba confirmar solo y con acompañante.</li>
                        <li><strong>Sin +1 (attendees_allowed=1):</strong> No debiese mostrar selector.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
