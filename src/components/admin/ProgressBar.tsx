'use client';

import React from 'react';
import { Users, Send } from 'lucide-react';

interface ProgressBarProps {
    sentCount: number;
    totalCount: number;
}

export default function ProgressBar({ sentCount, totalCount }: ProgressBarProps) {
    const percentage = totalCount > 0 ? Math.round((sentCount / totalCount) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Invitados</p>
                        <p className="text-2xl font-bold text-white">{totalCount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-white/5 p-6 rounded-3xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                        <Send size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Enviados</p>
                        <p className="text-2xl font-bold text-white">{sentCount}</p>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 bg-slate-900 border border-white/5 p-6 rounded-3xl flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Progreso de Envío</span>
                    <span className="text-xs text-emerald-400 font-bold">{percentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
