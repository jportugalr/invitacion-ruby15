'use client';

import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { getInvitation } from '@/lib/rpc';
import { Invitation } from '@/lib/types';
import { CheckCircle, XCircle, Search, RefreshCw, Smartphone } from 'lucide-react';

export default function ScannerPage() {
    const [scannedToken, setScannedToken] = useState<string | null>(null);
    const [invitation, setInvitation] = useState<Invitation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [manualInput, setManualInput] = useState('');
    const [isScanning, setIsScanning] = useState(true);

    const handleScan = async (rawToken: string) => {
        if (!rawToken || loading || scannedToken === rawToken) return;

        // Basic cleanup of token if it's a full URL
        let token = rawToken;
        try {
            if (rawToken.includes('/i/')) {
                const parts = rawToken.split('/i/');
                if (parts.length > 1) {
                    token = parts[1];
                }
            }
        } catch (e) {
            console.warn('Error parsing token URL', e);
        }

        // Clean any potential trailing slashes or query params
        token = token.split('?')[0].split('/')[0];

        setScannedToken(token);
        verifyToken(token);
    };

    const verifyToken = async (token: string) => {
        setLoading(true);
        setIsScanning(false);
        setError(null);
        setInvitation(null);

        try {
            const { data, error } = await getInvitation(token);

            if (error || !data) {
                setError('Invitación no encontrada o token inválido.');
            } else {
                setInvitation(data);
            }
        } catch (err) {
            setError('Error de conexión al verificar.');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualInput.trim().length < 5) return;
        handleScan(manualInput.trim());
    };

    const resetScanner = () => {
        setScannedToken(null);
        setInvitation(null);
        setError(null);
        setManualInput('');
        setIsScanning(true);
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
            <header className="mb-6 text-center">
                <h1 className="text-xl font-bold text-emerald-400 uppercase tracking-widest">Scanner de Acceso</h1>
                <p className="text-xs text-slate-500">XV Años Ruby Zavaleta</p>
            </header>

            {/* --- SCANNER VIEW --- */}
            {isScanning && (
                <div className="max-w-md mx-auto">
                    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-6 relative">
                        <div className="aspect-square relative">
                            <Scanner
                                onError={(err) => console.log(err)}
                                onScan={(detected) => {
                                    if (detected && detected.length > 0) {
                                        handleScan(detected[0].rawValue);
                                    }
                                }}
                                classNames={{
                                    container: 'w-full h-full'
                                }}
                            />
                            {/* Overlay UI */}
                            <div className="absolute inset-0 border-[40px] border-slate-900/50 pointer-events-none"></div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-48 h-48 border-2 border-emerald-500/50 rounded-lg relative">
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleManualSubmit} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Ingrese Token Manual"
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={manualInput.length < 5}
                            className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 p-3 rounded-lg disabled:opacity-50"
                        >
                            <Search size={20} />
                        </button>
                    </form>
                </div>
            )}

            {/* --- RESULT VIEW --- */}
            {!isScanning && (
                <div className="max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">

                    {loading && (
                        <div className="text-center py-12">
                            <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                            <p className="text-slate-400 text-sm animate-pulse">Verificando en base de datos...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-red-400 mb-2">Error de Lectura</h2>
                            <p className="text-red-200/80 mb-8">{error}</p>
                            <button
                                onClick={resetScanner}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-colors"
                            >
                                Escanear Nuevo
                            </button>
                        </div>
                    )}

                    {!loading && invitation && (
                        <div className={`rounded-2xl p-8 border-4 shadow-2xl text-center ${invitation.rsvp_status === 'confirmed'
                            ? 'bg-emerald-950/30 border-emerald-500 shadow-emerald-900/20'
                            : 'bg-red-950/30 border-red-500 shadow-red-900/20'
                            }`}>

                            {invitation.rsvp_status === 'confirmed' ? (
                                <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
                            ) : (
                                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                            )}

                            <h2 className={`text-3xl font-display mb-2 ${invitation.rsvp_status === 'confirmed' ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {invitation.rsvp_status === 'confirmed' ? 'ACCESO PERMITIDO' : 'DENEGADO'}
                            </h2>

                            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-slate-500">
                                {invitation.rsvp_status === 'confirmed' ? 'Invitación Confirmada' : `Estado: ${invitation.rsvp_status}`}
                            </p>

                            <div className="bg-slate-900/50 rounded-xl p-6 mb-8 text-left space-y-4">
                                <div>
                                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Nombre</label>
                                    <p className="text-xl font-bold text-white">{invitation.first_name} {invitation.last_name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Pases</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{invitation.attendees_count > 1 ? '👥' : '👤'}</span>
                                            <span className="text-xl font-bold text-white">{invitation.attendees_count}</span>
                                        </div>
                                    </div>
                                    {invitation.attendees_count > 1 && (
                                        <div>
                                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Acompañante</label>
                                            <p className="text-sm font-medium text-emerald-300 truncate">{invitation.companion_name || '-'}</p>
                                        </div>
                                    )}
                                </div>

                                {invitation.notes && (
                                    <div className="pt-4 border-t border-slate-800">
                                        <label className="block text-[10px] text-orange-400 uppercase tracking-wider mb-1">⚠️ Notas / Alergias</label>
                                        <p className="text-sm text-slate-300 italic">"{invitation.notes}"</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={resetScanner}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-colors shadow-lg shadow-emerald-900/50"
                            >
                                Sig. Invitado
                            </button>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
