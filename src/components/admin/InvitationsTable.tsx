'use client';

import React, { useState } from 'react';
import { AdminInvitation } from '@/lib/types';
import InvitationRow from './InvitationRow';
import ProgressBar from './ProgressBar';
import { Search, Filter } from 'lucide-react';

interface InvitationsTableProps {
    invitations: AdminInvitation[];
    onRefresh: () => void;
}

export default function InvitationsTable({ invitations, onRefresh }: InvitationsTableProps) {
    const [search, setSearch] = useState('');
    const [filterPending, setFilterPending] = useState(false);
    const [messageTemplate, setMessageTemplate] = useState('¡Hola {NOMBRE}! Dicen que los sueños se hacen realidad y el mío está a punto de cumplirse este 21 de febrero. Mi cuento de hadas no estaría completo sin una persona tan especial para mí como tú. \n\nEntra aquí para ver tu invitación real a mi noche mágica:\n\n{URL}\n\n¡Hagamos que esta noche sea inolvidable!');
    const [showTemplateEditor, setShowTemplateEditor] = useState(false);

    const filtered = invitations.filter(inv => {
        const matchesSearch = (inv.first_name + ' ' + inv.last_name).toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filterPending ? !inv.last_sent_at : true;
        return matchesSearch && matchesFilter;
    });

    const sentCount = invitations.filter(i => i.last_sent_at).length;
    const totalCount = invitations.length;

    return (
        <div className="space-y-6">
            <ProgressBar sentCount={sentCount} totalCount={totalCount} />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-white/5 text-white pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-body"
                    />
                </div>
                <button
                    onClick={() => setFilterPending(!filterPending)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition-all tracking-widest uppercase cursor-pointer ${filterPending
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    <Filter size={16} />
                    {filterPending ? 'Solo Pendientes' : 'Todos'}
                </button>
                <button
                    onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition-all tracking-widest uppercase cursor-pointer border ${showTemplateEditor
                        ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:bg-slate-800'
                        }`}
                >
                    Configurar Mensaje
                </button>
            </div>

            {showTemplateEditor && (
                <div className="bg-slate-900 border border-blue-500/30 p-6 rounded-3xl animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Plantilla WhatsApp</span>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">{'{NOMBRE}'}</span>
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">{'{URL}'}</span>
                        </div>
                    </div>
                    <textarea
                        value={messageTemplate}
                        onChange={(e) => setMessageTemplate(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:border-blue-500 min-h-[100px]"
                        placeholder="Escribe tu mensaje aquí..."
                    />
                </div>
            )}

            {/* Table */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-slate-500 uppercase text-[10px] font-bold tracking-[0.2em]">
                                <th className="py-4 px-4">Invitado</th>
                                <th className="py-4 px-4">Estado RSVP</th>
                                <th className="py-4 px-4">Teléfono (E.164)</th>
                                <th className="py-4 px-4">Último Envío</th>
                                <th className="py-4 px-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-500 italic">
                                        No se encontraron resultados
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(inv => (
                                    <InvitationRow
                                        key={inv.guest_id}
                                        invitation={inv}
                                        messageTemplate={messageTemplate}
                                        onRefresh={onRefresh}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
