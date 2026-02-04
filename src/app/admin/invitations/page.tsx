'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getSession, logout } from '@/lib/auth';
import { adminListInvitations } from '@/lib/adminRpc';
import { AdminInvitation } from '@/lib/types';
import { useRouter } from 'next/navigation';
import InvitationsTable from '@/components/admin/InvitationsTable';
import { LogOut, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';

// TODO: Find the actual event_id from the database or config
const DEFAULT_EVENT_ID = 'd6c7d2d0-7d6a-4a2e-8f55-9b75f5d7e3a1';

export default function AdminInvitationsPage() {
    const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const fetchInvitations = useCallback(async () => {
        setRefreshing(true);
        const { data, error: rpcError } = await adminListInvitations(DEFAULT_EVENT_ID);
        if (rpcError) {
            setError(rpcError);
        } else if (data) {
            setInvitations(data);
            setError(null);
        }
        setRefreshing(false);
        setLoading(false);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const { session, error: authError } = await getSession();
            if (authError || !session) {
                router.push('/admin/login');
            } else {
                setUser(session.user);
                fetchInvitations();
            }
        };
        checkAuth();
    }, [router, fetchInvitations]);

    const handleLogout = async () => {
        await logout();
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium animate-pulse">Cargando panel de control...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-body">
            {/* Nav */}
            <nav className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                            <ShieldCheck className="text-slate-950 w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white tracking-tight">Admin | Ruby XV</h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Staff Control Panel</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-bold text-white truncate max-w-[150px]">{user?.email}</p>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase">Staff Autorizado</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-3 bg-slate-800 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all cursor-pointer group"
                            title="Cerrar Sesión"
                        >
                            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Gestión de Invitados</h2>
                        <p className="text-slate-400">Administra los envíos de WhatsApp y realiza el seguimiento de confirmaciones.</p>
                    </div>
                    <button
                        onClick={fetchInvitations}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                        Actualizar Lista
                    </button>
                </div>

                {error ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-3xl text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Error al cargar datos</h3>
                        <p className="text-red-400 mb-6 max-w-md mx-auto">{error}</p>
                        <button
                            onClick={fetchInvitations}
                            className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <InvitationsTable invitations={invitations} onRefresh={fetchInvitations} />
                )}
            </main>

            <footer className="py-10 text-center border-t border-white/5">
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold">Ruby Zavaleta • Trujillo 2026</p>
            </footer>
        </div>
    );
}

function AlertCircle({ className, ...props }: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    )
}
