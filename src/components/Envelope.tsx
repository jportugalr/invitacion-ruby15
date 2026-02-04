'use client';

import React, { useState } from 'react';
import { Crown } from 'lucide-react';

interface EnvelopeProps {
    guestName?: string;
    onOpen: () => void;
}

export default function Envelope({ guestName = "Familia y Amigos", onOpen }: EnvelopeProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
        // Delay calling parent onOpen slightly to allow animation to start or finish 
        // depending on how the parent handles it. 
        // In the user's snippet, the class 'slide-up' is controlled by state.
        // Here we manage local state for the animation class, and call onOpen to signal completion or start.
        setTimeout(() => {
            onOpen();
        }, 800); // Wait for part of the animation
    };

    return (
        <div className={`fixed inset-0 z-[100] bg-emerald-950 flex flex-col items-center justify-center envelope-transition ${isOpen ? 'slide-up' : ''}`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-0 w-full h-1/2 bg-emerald-900 rounded-b-[100%] shadow-2xl origin-top transition-transform"></div>

            <div className="relative z-10 text-center p-6 md:p-8 max-w-sm w-full">
                <div className="bg-white p-1 rounded-full inline-block mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-float">
                    <div className="w-24 h-24 rounded-full border-2 border-emerald-900 flex items-center justify-center bg-emerald-50">
                        <Crown size={40} className="text-amber-500" strokeWidth={1.5} />
                    </div>
                </div>

                <h2 className="font-script text-6xl text-amber-200 mb-2">Ruby Zavaleta</h2>
                <p className="font-title text-xs tracking-[0.4em] text-emerald-200 uppercase mb-12">Invitación Real</p>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg mb-8 mx-4">
                    <p className="text-[10px] text-emerald-300 uppercase tracking-widest mb-2">Invitado de Honor:</p>
                    <p className="font-title text-xl text-white">{guestName}</p>
                </div>

                <button
                    onClick={handleOpen}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 font-title font-bold py-4 px-10 rounded-full text-xs tracking-widest uppercase hover:scale-105 transition-transform shadow-[0_0_20px_rgba(251,191,36,0.5)] cursor-pointer"
                >
                    Abrir Sobre
                </button>
            </div>
        </div>
    );
}
