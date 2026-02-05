'use client';

import React, { useState, useRef } from 'react';
import { Play } from 'lucide-react';

export default function MusicPlayer() {
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsMusicPlaying(!isMusicPlaying);
        }
    };

    return (
        <div className="fixed top-10 right-6 z-50">
            <button onClick={toggleMusic} className="bg-white/90 backdrop-blur shadow-xl p-3 rounded-full hover:scale-110 transition-transform border-2 border-emerald-400 group cursor-pointer">
                {isMusicPlaying ? (
                    <div className="flex gap-1 h-3 items-end">
                        <span className="w-1 h-3 bg-emerald-500 animate-pulse" />
                        <span className="w-1 h-4 bg-teal-400 animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-emerald-300 animate-pulse delay-150" />
                    </div>
                ) : (
                    <Play size={18} className="text-emerald-500 ml-0.5 fill-current" />
                )}
            </button>
            <audio ref={audioRef} loop src="/audio/music.mp3" />
        </div>
    );
};
