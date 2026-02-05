'use client';

import { BACKGROUNDS, getBackgroundStyle } from '@/lib/assets';

import React from 'react';
import { Navigation, Heart, Sparkles, Copy } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function EventInfo() {

    const copyToClipboard = (text: string, id: string) => {
        if (!navigator?.clipboard) return;
        navigator.clipboard.writeText(text);
        const btn = document.getElementById(id);
        if (btn) {
            const original = btn.innerHTML;
            btn.innerHTML = "<span class='text-emerald-600 font-bold'>¡Copiado!</span>";
            setTimeout(() => btn.innerHTML = original, 2000);
        }
    };

    return (
        <>
            {/* --- MENSAJE --- */}
            <ScrollReveal direction="right">
                <section className="py-24 px-6 max-w-2xl mx-auto text-center" style={getBackgroundStyle(BACKGROUNDS.eventInfo.messageSection)}>
                    <div className="relative inline-block">
                        <Heart className="w-12 h-12 text-teal-400 fill-teal-50 mx-auto mb-6 animate-pulse" />
                        <Sparkles className="absolute -top-2 -right-4 w-6 h-6 text-emerald-400 animate-spin-slow" />
                    </div>
                    <h3 className="font-script text-5xl md:text-6xl text-emerald-800 mb-6 py-2 leading-relaxed drop-shadow-sm">¡Celebremos la vida!</h3>
                    <p className="font-body text-lg text-slate-600 leading-loose">
                        "Como la esmeralda que simboliza esperanza y renovación, inicio esta nueva etapa agradeciendo primeramente a Dios, el autor de toda magia y el creador de mis sueños, por permitirme vivir este momento. Quiero compartir Su bendición contigo, porque cada instante de felicidad es más brillante cuando caminamos de Su mano."
                    </p>
                </section>
            </ScrollReveal>

            {/* --- LA FIESTA --- */}
            <ScrollReveal direction="left">
                <section className="py-24 px-4 bg-white relative" style={getBackgroundStyle(BACKGROUNDS.eventInfo.partySection)}>
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-emerald-50 rounded-[3rem] p-8 md:p-16 relative overflow-hidden" style={BACKGROUNDS.eventInfo.partySection ? { backgroundColor: 'rgba(255,255,255,0.9)' } : {}}>
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/2"></div>

                            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">

                                <div className="text-center md:text-left">
                                    <span className="bg-white px-4 py-1 rounded-full text-xs font-bold text-teal-600 uppercase tracking-wider mb-4 inline-block shadow-sm">Recepción & Fiesta</span>
                                    <h3 className="font-script text-6xl md:text-7xl text-emerald-900 mb-6 py-2 leading-[1.1]">Restaurante <br /> <span className="text-emerald-600">La Fortaleza</span></h3>
                                    <p className="font-body text-slate-600 mb-8 max-w-sm mx-auto md:mx-0">
                                        Campiña de Moche <br /> Un lugar mágico para una noche mágica.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                        <button onClick={() => window.open('https://waze.com/ul/h6nxcd3f7c')} className="px-8 py-4 bg-slate-800 text-white rounded-full font-bold text-xs hover:bg-slate-700 transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                                            <Navigation size={14} /> IR CON WAZE
                                        </button>
                                        <button onClick={() => window.open('https://maps.app.goo.gl/BeWj6Jk2QZbYjkCp9')} className="px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-full font-bold text-xs hover:bg-slate-50 transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                                            <span className="text-green-600">📍</span> GOOGLE MAPS
                                        </button>
                                    </div>
                                </div>

                                {/* Itinerario */}
                                <div className="bg-white/80 backdrop-blur p-8 rounded-3xl shadow-sm border border-white">
                                    <h4 className="font-script text-4xl text-emerald-800 mb-8 py-2 leading-relaxed text-center">Itinerario Real</h4>
                                    <div className="space-y-8 relative before:absolute before:left-8 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                        {[
                                            { time: '20:00', label: 'Bienvenida', icon: '🍸', color: 'bg-emerald-100' },
                                            { time: '22:30', label: 'Vals & Cena', icon: '🍽️', color: 'bg-teal-100' },
                                            { time: '23:30', label: '¡Hora Loca!', icon: '💃', color: 'bg-green-100' },
                                            // { time: '02:00', label: 'Fin de Fiesta', icon: '🌙', color: 'bg-slate-200' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-6 relative">
                                                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-3xl shadow-sm z-10 transform hover:scale-105 transition-transform duration-300`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <span className="block font-display text-xl text-slate-800">{item.time}</span>
                                                    <span className="text-slate-500 font-body text-sm font-medium uppercase tracking-wide">{item.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* --- DRESS CODE --- */}
            <ScrollReveal direction="right">
                <section className="py-20 text-center bg-white" style={getBackgroundStyle(BACKGROUNDS.eventInfo.dressCodeSection)}>
                    <h3 className="font-script text-6xl text-emerald-900 mb-12 py-2 leading-relaxed">Protocolo Real</h3>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {/* Ellas */}
                        <div className="w-40 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👗</div>
                            <p className="font-bold text-slate-700 uppercase text-xs tracking-widest mb-1">Ellas</p>
                            <p className="font-display text-xl text-slate-800">Sport Elegante</p>
                        </div>

                        {/* Forbidden Color */}
                        <div className="w-40 p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200 hover:shadow-lg transition-all group relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-12 h-12 bg-red-500 text-white flex items-center justify-center rounded-full text-xs font-bold rotate-12 z-10">NO</div>
                            <div className="w-16 h-16 bg-emerald-500 rounded-full mx-auto mb-4 border-4 border-white shadow-sm group-hover:scale-110 transition-transform duration-300"></div>
                            <p className="font-bold text-slate-500 uppercase text-[10px] tracking-widest mb-1 line-through decoration-red-500">Verde</p>
                            <p className="font-body text-xs font-bold text-red-500 leading-tight">Reservado para Ruby</p>
                        </div>

                        {/* Ellos */}
                        <div className="w-40 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👔</div>
                            <p className="font-bold text-slate-700 uppercase text-xs tracking-widest mb-1">Ellos</p>
                            <p className="font-display text-xl text-slate-800">Sport Elegante</p>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* --- REGALOS --- */}
            <ScrollReveal direction="left">
                <section className="py-24 px-4 text-center bg-slate-50" style={getBackgroundStyle(BACKGROUNDS.eventInfo.giftsSection)}>
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">

                            {/* Decoración */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-300 to-teal-400"></div>

                            <div className="inline-block p-4 bg-emerald-50 rounded-full mb-6 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="m22 5-10 9L2 5" /></svg>
                            </div>

                            <h3 className="font-script text-5xl text-emerald-900 mb-6 py-2 leading-relaxed">Lluvia de Sobres</h3>
                            <p className="font-body text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto">
                                "Tu presencia en este día tan especial es el mejor regalo, pero si deseas obsequiarme un detalle, una contribución en efectivo será recibida con mucho cariño y gratitud."
                            </p>

                            <button id="btn-yape" onClick={() => copyToClipboard('958 746 379', 'btn-yape')} className="bg-slate-50 hover:bg-[#742384] hover:text-white px-8 py-5 rounded-2xl border border-slate-200 flex items-center gap-6 transition-all hover:scale-105 hover:shadow-xl text-lg font-bold text-slate-700 cursor-pointer group w-full max-w-sm mx-auto">
                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm p-2 group-hover:scale-110 transition-transform">
                                    <img src="/yape-logo.svg" alt="Yape" className="w-full h-full object-contain" />
                                </div>
                                <span className="flex flex-col text-left">
                                    <span className="text-xs text-slate-400 group-hover:text-white/80 uppercase tracking-widest mb-1">Yapear a Ruby</span>
                                    <span className="font-display text-2xl tracking-wider">958 746 379</span>
                                </span>
                                <Copy size={24} className="text-slate-300 group-hover:text-white ml-auto" />
                            </button>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </>
    );
}
