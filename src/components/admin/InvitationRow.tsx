'use client';

import React, { useState } from 'react';
import { AdminInvitation } from '@/lib/types';
import { adminUpdateGuestPhone, adminMarkInvitationSent } from '@/lib/adminRpc';
import { MessageSquare, Check, Save, Loader2, AlertCircle, Phone, ExternalLink, Copy } from 'lucide-react';

interface InvitationRowProps {
    invitation: AdminInvitation;
    messageTemplate: string;
    onRefresh: () => void;
}

export default function InvitationRow({ invitation, messageTemplate, onRefresh }: InvitationRowProps) {
    const [phone, setPhone] = useState(invitation.phone_e164 || '');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validatePhone = (p: string) => {
        // Peru specific: +51 followed by 9 digits, or just 9 digits
        const clean = p.replace(/\D/g, '');
        if (clean.length === 9) return `+51${clean}`;
        if (clean.length === 11 && clean.startsWith('51')) return `+${clean}`;
        return null;
    };

    const handleUpdatePhone = async () => {
        const formattedPhone = validatePhone(phone);
        if (!formattedPhone) {
            setError('Ingresa 9 dígitos (ej: 969203446)');
            return;
        }

        setLoading(true);
        setError(null);
        const { error: rpcError } = await adminUpdateGuestPhone(invitation.guest_id, formattedPhone);

        if (rpcError) {
            setError(rpcError);
        } else {
            setPhone(formattedPhone);
            setIsEditing(false);
            onRefresh();
        }
        setLoading(false);
    };

    const handleMarkSent = async () => {
        if (!invitation.phone_e164) {
            setError('Primero guarda el teléfono');
            return;
        }

        setLoading(true);
        const baseUrl = window.location.origin;
        const inviteUrl = `${baseUrl}/i/${invitation.invite_token}`;
        const firstName = invitation.first_name.split(' ')[0];
        const finalMessage = messageTemplate
            .replace('{NOMBRE}', firstName)
            .replace('{URL}', inviteUrl);

        const { error: rpcError } = await adminMarkInvitationSent(
            invitation.guest_id,
            invitation.phone_e164,
            inviteUrl,
            finalMessage
        );

        if (rpcError) {
            setError(rpcError);
        } else {
            onRefresh();
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        const baseUrl = window.location.origin;
        const inviteUrl = `${baseUrl}/i/${invitation.invite_token}`;
        const firstName = invitation.first_name.split(' ')[0];
        const finalMessage = messageTemplate
            .replace('{NOMBRE}', firstName)
            .replace('{URL}', inviteUrl);

        navigator.clipboard.writeText(finalMessage).then(() => {
            // Optional: Show a temporary success state
            alert('Mensaje copiado al portapapeles');
        });
    };

    const openWhatsApp = () => {
        if (!invitation.phone_e164) return;

        const baseUrl = window.location.origin;
        const inviteUrl = `${baseUrl}/i/${invitation.invite_token}`;
        const firstName = invitation.first_name.split(' ')[0];
        const finalMessage = messageTemplate
            .replace('{NOMBRE}', firstName)
            .replace('{URL}', inviteUrl);

        // Remove '+' for wa.me
        const digits = invitation.phone_e164.replace('+', '');
        const encodedText = encodeURIComponent(finalMessage);

        window.open(`https://wa.me/${digits}?text=${encodedText}`, '_blank');
    };

    const isPhoneValid = !!validatePhone(phone);

    return (
        <tr className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors group">
            <td className="py-4 px-4">
                <div className="flex flex-col">
                    <span className="text-white font-medium">{invitation.first_name} {invitation.last_name}</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">{invitation.invite_token.slice(0, 8)}</span>
                </div>
            </td>

            <td className="py-4 px-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${invitation.rsvp_status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            invitation.rsvp_status === 'declined' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                            }`}>
                            {invitation.rsvp_status}
                        </span>
                        {invitation.plus_one_allowed && (
                            <span className="text-[10px] text-teal-500 font-bold uppercase">+1</span>
                        )}
                    </div>
                    {invitation.rsvp_status === 'confirmed' && (
                        <span className="text-[10px] text-slate-500">
                            {invitation.attendees_count} asistentes
                        </span>
                    )}
                </div>
            </td>

            <td className="py-4 px-4 min-w-[200px]">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+51..."
                            className="bg-slate-800/50 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-500"
                        />
                        <button
                            onClick={handleUpdatePhone}
                            disabled={loading || !isPhoneValid}
                            className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 disabled:opacity-50 transition-all"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-4">
                        <span className={`text-xs ${invitation.phone_e164 ? 'text-white' : 'text-slate-600 italic'}`}>
                            {invitation.phone_e164 || 'Sin número'}
                        </span>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-emerald-500 p-1.5 hover:bg-emerald-500/10 rounded-lg transition-all"
                        >
                            <Phone size={14} />
                        </button>
                    </div>
                )}
                {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
            </td>

            <td className="py-4 px-4">
                <div className="flex flex-col">
                    {invitation.last_sent_at ? (
                        <>
                            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                                <Check size={14} /> Enviado
                            </div>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                                {new Date(invitation.last_sent_at).toLocaleDateString()} a {invitation.last_sent_phone}
                            </span>
                        </>
                    ) : (
                        <span className="text-xs text-slate-600">Pendiente</span>
                    )}
                </div>
            </td>

            <td className="py-4 px-4">
                <div className="flex items-center gap-2 justify-end">
                    <button
                        onClick={openWhatsApp}
                        disabled={!invitation.phone_e164}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 transition-all cursor-pointer"
                        title="Abrir WhatsApp Web"
                    >
                        <MessageSquare size={14} />
                        <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 transition-all cursor-pointer"
                        title="Copiar Invitación"
                    >
                        <Copy size={14} />
                        <span className="hidden sm:inline">Copiar</span>
                    </button>

                    <button
                        onClick={handleMarkSent}
                        disabled={loading || !invitation.phone_e164}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${invitation.last_sent_at
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'
                            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                            } disabled:opacity-30`}
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        <span className="hidden sm:inline font-bold">Marcar Enviado</span>
                    </button>
                </div>
            </td>
        </tr>
    );
}
