'use client';

import { BACKGROUNDS, getBackgroundStyle } from '@/lib/assets';
import ScrollReveal from './ScrollReveal';

import React, { useState, useEffect, useCallback } from 'react';
import { Music, Mic2, Plus, Disc, ThumbsUp, AlertCircle } from 'lucide-react';
import { SongRequest, Invitation } from '@/lib/types';
import { listSongRequests, submitSongRequest, voteSongRequest } from '@/lib/rpc';

interface DJSectionProps {
    invitation?: Invitation;
}

export default function DJSection({ invitation }: DJSectionProps) {
    const [songRequest, setSongRequest] = useState('');
    const [songs, setSongs] = useState<SongRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSongs = useCallback(async () => {
        if (!invitation?.invite_token) return;
        try {
            setLoading(true);
            const { data, error } = await listSongRequests(invitation.invite_token);
            if (data) setSongs(data);
        } catch (err) {
            console.warn('Error loading songs', err);
        } finally {
            setLoading(false);
        }
    }, [invitation?.invite_token]);

    useEffect(() => {
        if (invitation) fetchSongs();
    }, [invitation, fetchSongs]);

    const handleSongSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        let cleanedQuery = songRequest.trim();
        if (!cleanedQuery || !invitation) return;

        // 1. Longitud mínima
        if (cleanedQuery.length < 3) {
            setError('El nombre es demasiado corto.');
            return;
        }

        // 2. Verificar duplicados en la lista actual (Frontend check)
        const isDuplicate = songs.some(s => s.query_text.toLowerCase() === cleanedQuery.toLowerCase());
        if (isDuplicate) {
            setError('Esta canción ya ha sido pedida.');
            return;
        }

        // 3. Intento de validar formato (Opcional, pero recomendado)
        if (!cleanedQuery.includes('-')) {
            // No bloqueamos, pero podríamos sugerir. 
            // Para ser más estrictos:
            // setError('Usa el formato: Canción - Artista');
            // return;
        }

        setSubmitting(true);
        const { error: rpcError } = await submitSongRequest(invitation.invite_token, cleanedQuery);

        if (rpcError) {
            if (rpcError.includes('SUGGESTION_LIMIT_REACHED')) {
                setError('Has alcanzado el límite de 5 sugerencias.');
            } else if (rpcError.includes('QUERY_TEXT_TOO_LONG')) {
                setError('El texto de la canción es muy largo.');
            } else if (rpcError.includes('duplicate') || rpcError.includes('unique')) {
                setError('Esta canción ya está en la lista.');
            } else {
                setError('Error al enviar. Intenta de nuevo.');
            }
        } else {
            setSongRequest('');
            fetchSongs();
        }
        setSubmitting(false);
    };

    const handleVote = async (songId: string) => {
        if (!invitation) return;
        const { error: rpcError } = await voteSongRequest(invitation.invite_token, songId);
        if (!rpcError) fetchSongs();
    };

    if (!invitation) return null;

    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden" id="dj-section" style={getBackgroundStyle(BACKGROUNDS.dj.image)}>
            <div className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 z-0 ${BACKGROUNDS.dj.image ? 'opacity-80' : ''}`}></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px] opacity-10"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <ScrollReveal direction="down">
                    <div className="text-center mb-16">
                        <div className="inline-block p-4 bg-emerald-500/10 rounded-full mb-6 border border-emerald-500/20">
                            <Music className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h2 className="font-script text-6xl md:text-7xl mb-4 py-4 leading-relaxed bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">DJ & Música</h2>
                        <p className="text-emerald-300 font-body tracking-[0.2em] uppercase text-xs">Ayúdanos a armar el Playlist Real</p>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.3}>
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Formulario */}
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
                            <h3 className="font-display text-xl mb-6 text-emerald-400">Pide tu canción</h3>
                            <form onSubmit={handleSongSubmit} className="relative">
                                <div className="absolute left-4 top-4 text-slate-500"><Mic2 size={18} /></div>
                                <input
                                    type="text"
                                    value={songRequest}
                                    onChange={(e) => setSongRequest(e.target.value)}
                                    placeholder="Canción - Artista..."
                                    maxLength={120}
                                    disabled={submitting}
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-14 py-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-colors disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !songRequest.trim()}
                                    className="absolute right-2 top-2 bottom-2 bg-emerald-500 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-emerald-400 transition-colors text-slate-900 cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? <div className="animate-spin w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full" /> : <Plus size={20} />}
                                </button>
                            </form>
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
                                    <AlertCircle size={14} />
                                    <span>{error}</span>
                                </div>
                            )}
                            <p className="text-xs text-slate-500 mt-6 leading-relaxed">
                                * Se permite un máximo de 5 canciones por invitado. Por favor, asegúrate de escribir bien el nombre y el artista.
                            </p>
                        </div>

                        {/* Playlist */}
                        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 h-[500px] flex flex-col">
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Sugerencias</span>
                                <Disc size={18} className="text-emerald-500 animate-spin-slow" />
                            </div>

                            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                                {songs.length === 0 && !loading && (
                                    <div className="text-center py-10 text-slate-500 text-sm">
                                        <p>Aún no hay canciones.</p>
                                        <p>¡Sé el primero en pedir una!</p>
                                    </div>
                                )}

                                {songs.map((song) => (
                                    <div key={song.song_request_id} className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${song.i_voted ? 'bg-emerald-900/10 border-emerald-500/20' : 'hover:bg-slate-700/50 border-transparent'}`}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-sm truncate">{song.query_text}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 truncate max-w-[100px]">
                                                    {song.guest_name}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => !song.i_voted && handleVote(song.song_request_id)}
                                            disabled={song.i_voted}
                                            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all ${song.i_voted
                                                ? 'bg-emerald-50 text-slate-900 cursor-default'
                                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600 cursor-pointer'
                                                }`}
                                        >
                                            {song.i_voted ? <Disc size={18} className="animate-spin-slow" /> : <ThumbsUp size={16} />}
                                            <span className="text-[10px] font-bold mt-0.5">{song.votes_count}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
