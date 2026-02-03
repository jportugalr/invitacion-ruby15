'use client';

import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Timeline() {
    const timelineRef = useRef<HTMLDivElement>(null);

    const scrollTimeline = (direction: 'left' | 'right') => {
        if (timelineRef.current) {
            const scrollAmount = 300;
            timelineRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const timelineEvents = [
        { year: '2011', title: 'El Comienzo', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400' },
        { year: '2015', title: 'Primeros Pasos', img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=400' },
        { year: '2019', title: 'Descubriendo', img: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400' },
        { year: '2023', title: 'Soñando', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400' },
        { year: '2026', title: 'Hoy', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400' },
    ];

    return (
        <section className="py-20 bg-slate-50 overflow-hidden relative">
            <div className="max-w-6xl mx-auto px-6 relative">
                <div className="flex justify-between items-end mb-8">
                    <h3 className="font-display text-4xl text-slate-800">15 Años de Luz</h3>
                    <div className="flex gap-2">
                        <button onClick={() => scrollTimeline('left')} className="p-2 rounded-full bg-white shadow hover:bg-emerald-100 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <button onClick={() => scrollTimeline('right')} className="p-2 rounded-full bg-white shadow hover:bg-emerald-100 transition-colors">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                <div
                    ref={timelineRef}
                    className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory scroll-smooth"
                >
                    {timelineEvents.map((event, idx) => (
                        <div key={idx} className="snap-center shrink-0 w-72 relative group">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-4 border-white transform transition-transform duration-300 group-hover:-translate-y-2">
                                <img src={event.img} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <span className="font-display text-5xl text-emerald-300 opacity-90">{event.year}</span>
                                </div>
                            </div>
                            <p className="mt-4 text-center font-bold text-slate-700 font-body uppercase tracking-wider text-sm">{event.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
