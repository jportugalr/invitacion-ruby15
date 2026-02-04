'use client';

import React, { useState, useEffect } from 'react';
import { Invitation } from '@/lib/types';
import { ChevronDown, Heart } from 'lucide-react';

interface HeroProps {
    invitation: Invitation;
}

export default function Hero({ invitation }: HeroProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Event Date: Feb 22, 2026 19:00:00
    useEffect(() => {
        const eventDate = new Date('2026-02-21T19:00:00');
        const timer = setInterval(() => {
            const now = new Date();
            const diff = eventDate.getTime() - now.getTime();
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60)
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {/* --- HERO: EMERALD & ELEGANT --- */}
            <header className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-emerald-50">

                {/* Decorative Background */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-200 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-100 rounded-full blur-[100px] opacity-70"></div>

                <div className="relative z-10 px-4 animate-float">
                    <div className="mb-4 inline-block bg-white px-4 py-1 rounded-full shadow-sm border border-emerald-100 transform -rotate-2">
                        <p className="font-body text-slate-500 text-xs tracking-[0.3em] uppercase font-bold">Save the Date</p>
                    </div>

                    <h1 className="font-display text-6xl md:text-9xl text-emerald-600 mb-0 leading-[0.9] drop-shadow-sm">
                        <span className="text-slate-800">Ruby</span><br />
                        Zavaleta
                    </h1>

                    <p className="font-script text-4xl md:text-5xl text-teal-500 mt-4 rotate-2">Mis Quince Años</p>

                    {invitation && (
                        <p className="mt-8 font-body text-slate-600 uppercase tracking-widest text-sm">
                            Invitado: <span className="font-bold text-emerald-600">{invitation.first_name} {invitation.last_name}</span>
                        </p>
                    )}

                    {/* Original Date Box */}
                    <div className="mt-8 bg-white/60 backdrop-blur-sm border border-white p-4 rounded-2xl inline-flex flex-col items-center gap-2 shadow-sm">
                        <div className="flex items-center gap-4 text-slate-700 font-bold font-body text-sm md:text-base tracking-widest uppercase">
                            <span>21 Feb</span>
                            <span className="text-emerald-500">●</span>
                            <span>2026</span>
                        </div>
                        <div className="w-full h-px bg-slate-200"></div>
                        <span className="text-slate-500 text-xs font-bold tracking-widest">TRUJILLO, PERÚ</span>
                    </div>

                    {/* Visual Calendar */}
                    <div className="mt-8 mb-8 relative z-10">
                        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-emerald-100/50 max-w-xs mx-auto">
                            <h3 className="font-serif text-xl text-emerald-900 uppercase tracking-widest mb-4 border-b border-emerald-100 pb-2">Febrero</h3>

                            {/* Días Semana */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                                    <span key={`${d}-${i}`} className="font-bold text-emerald-600 text-xs font-serif">{d}</span>
                                ))}
                            </div>

                            {/* Días Números */}
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                    <div key={day} className="flex items-center justify-center relative h-8">
                                        {day === 21 ? (
                                            <div className="relative flex items-center justify-center w-8 h-8">
                                                <Heart className="absolute w-8 h-8 text-emerald-300 fill-emerald-200 animate-pulse-heart opacity-60" />
                                                <span className="relative z-10 font-serif font-bold text-emerald-900">{day}</span>
                                            </div>
                                        ) : (
                                            <span className="font-serif text-slate-500 text-sm hover:text-emerald-500 transition-colors cursor-default">{day}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 animate-float">
                    <ChevronDown className="text-emerald-400 w-10 h-10" />
                </div>
            </header>

            {/* --- COUNTDOWN --- */}
            <div className="bg-emerald-500 py-8 relative z-20 shadow-md">
                <div className="max-w-4xl mx-auto flex justify-center gap-6 md:gap-16 px-4 text-white">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="text-center flex flex-col">
                            <span className="font-display text-4xl md:text-6xl leading-none">{value}</span>
                            <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold opacity-80">{unit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
