'use client';

import { BACKGROUNDS, getBackgroundStyle } from '@/lib/assets';
import ScrollReveal from './ScrollReveal';

import React, { useState } from 'react';
import { Invitation } from '@/lib/types';
import { submitRsvp } from '@/lib/rpc';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle } from 'lucide-react';

interface RSVPFormProps {
    invitation: Invitation;
}

export default function RSVPForm({ invitation }: RSVPFormProps) {
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState<'confirmed' | 'declined' | null>(
        invitation.rsvp_status === 'pending' ? null : invitation.rsvp_status
    );
    // Logic: If plus_one_allowed is true
    const plusOneAllowed = invitation.plus_one_allowed;

    // State for form
    const [attendeesCount, setAttendeesCount] = useState<number>(invitation.attendees_count > 0 ? invitation.attendees_count : 1);
    const [companionName, setCompanionName] = useState(invitation.companion_name || '');
    const [notes, setNotes] = useState(invitation.notes || '');

    // UI Logic
    const [loading, setLoading] = useState(false);
    const [rsvpStep, setRsvpStep] = useState(invitation.rsvp_status === 'pending' ? 1 : 2);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!status) return;

        // Validation: If 2 attendees, companion name is required
        if (status === 'confirmed' && attendeesCount > 1 && !companionName.trim()) {
            setError('Por favor ingresa el nombre de tu acompañante.');
            return;
        }

        setLoading(true);

        const { error: rpcError } = await submitRsvp(
            invitation.invite_token,
            status,
            status === 'confirmed' ? attendeesCount : 1,
            status === 'confirmed' && attendeesCount > 1 ? companionName : null,
            notes.trim() || null
        );

        if (rpcError) {
            // Map backend errors to friendly messages
            if (rpcError.includes('RSVP_DEADLINE_PASSED')) {
                setError('Lo sentimos, la fecha límite para confirmar ha pasado.');
            } else if (rpcError.includes('PLUS_ONE_NOT_ALLOWED')) {
                setError('Esta invitación no permite acompañantes adicionales.');
            } else if (rpcError.includes('COMPANION_NAME_REQUIRED')) {
                setError('El nombre del acompañante es obligatorio.');
            } else {
                setError('Ocurrió un error al enviar tu respuesta. Intenta nuevamente.');
            }
        } else {
            setRsvpStep(2);
            if (status === 'confirmed') triggerConfetti();
        }
        setLoading(false);
    };

    const triggerConfetti = () => {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        const colors = ['#10B981', '#34D399', '#FCD34D', '#059669'];

        for (let i = 0; i < 60; i++) {
            const confetto = document.createElement('div');
            confetto.classList.add('confetto');
            confetto.style.left = Math.random() * 100 + '%';
            confetto.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetto.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(confetto);
        }
    };

    return (
        <>
            {/* --- CTA CONFIRMACIÓN --- */}
            <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden" style={getBackgroundStyle(BACKGROUNDS.rsvp.ctaSection)}>
                <div className={`absolute inset-0 bg-slate-900 ${BACKGROUNDS.rsvp.ctaSection ? 'opacity-70' : 'opacity-20'}`}></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500"></div>

                <div className="relative z-10 px-6 max-w-2xl mx-auto">
                    <ScrollReveal distance={20} duration={1}>
                        <h2 className="font-script text-6xl md:text-8xl mb-8 py-2 leading-relaxed text-emerald-300">¿Estás listo?</h2>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.4}>
                        <p className="font-body text-xl mb-12 text-slate-300 italic">
                            Sería un honor contar con tu presencia en esta noche que he soñado tanto.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal distance={30} delay={0.6}>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-title font-bold py-6 px-16 rounded-full text-sm tracking-widest uppercase hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.4)] cursor-pointer"
                        >
                            {invitation.rsvp_status === 'pending' ? 'Confirmar Asistencia' : 'Ver Mi Pase'}
                        </button>
                    </ScrollReveal>
                </div>
            </section>

            {/* --- MODAL RSVP PREMIUM --- */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/90 backdrop-blur-md">
                    {/* Contenedor Confeti */}
                    <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none z-50"></div>

                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden animate-float ring-4 ring-emerald-500/20">

                        {/* Cabecera Tipo Ticket */}
                        <div className="bg-emerald-600 p-8 text-center relative overflow-hidden">
                            {/* Decorative Circles */}
                            <div className="absolute -left-6 -top-6 w-24 h-24 bg-emerald-500 rounded-full opacity-50"></div>
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-400 rounded-full opacity-50"></div>

                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white cursor-pointer backdrop-blur-sm transition-all"><X size={16} /></button>

                            <div className="relative z-10">
                                <h3 className="font-display text-5xl text-white mb-2 drop-shadow-sm">Pase de Ingreso</h3>
                                <div className="inline-block border-t border-b border-emerald-400/50 py-1 px-4 mt-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-100">XV AÑOS RUBY ZAVALETA</p>
                                </div>
                            </div>
                        </div>

                        {/* Cuerpo del Modal */}
                        <div className="p-6 md:p-8 bg-white relative">
                            {/* Texture Noise */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('${BACKGROUNDS.rsvp.modalTexture}')` }}></div>

                            {rsvpStep === 1 ? (
                                <form onSubmit={handleSubmit} className="relative z-10">

                                    <div className="mb-8">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Invitado Principal</label>
                                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center">
                                            <span className="text-xl font-display text-slate-800">{invitation.first_name} {invitation.last_name}</span>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tu Respuesta</label>
                                        <div className="flex gap-4">
                                            <label className={`flex-1 relative overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 ${status === 'confirmed' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="attend"
                                                    className="peer sr-only"
                                                    checked={status === 'confirmed'}
                                                    onChange={() => setStatus('confirmed')}
                                                />
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                    <CheckCircle size={16} />
                                                </div>
                                                <span className={`text-xs font-bold tracking-widest ${status === 'confirmed' ? 'text-emerald-700' : 'text-slate-500'}`}>SÍ, VOY</span>
                                            </label>

                                            <label className={`flex-1 relative overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 ${status === 'declined' ? 'border-slate-400 bg-slate-50' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="attend"
                                                    className="peer sr-only"
                                                    checked={status === 'declined'}
                                                    onChange={() => {
                                                        setStatus('declined');
                                                    }}
                                                />
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${status === 'declined' ? 'bg-slate-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                    <X size={16} />
                                                </div>
                                                <span className={`text-xs font-bold tracking-widest ${status === 'declined' ? 'text-slate-700' : 'text-slate-500'}`}>NO PUEDO</span>
                                            </label>
                                        </div>
                                    </div>

                                    {status === 'confirmed' && (
                                        <div className="space-y-6 mb-8 animate-in slide-in-from-top-4 fade-in duration-500">

                                            {/* Selector de Asistentes (+1 Logic) */}
                                            {plusOneAllowed ? (
                                                <div className="mb-6">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">¿Vienes solo o acompañado?</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {/* Opción Solo Yo */}
                                                        <div
                                                            onClick={() => setAttendeesCount(1)}
                                                            className={`relative overflow-hidden rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 ${attendeesCount === 1 ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-slate-100 hover:border-slate-300'}`}
                                                        >
                                                            <div className="flex flex-col items-center gap-2">
                                                                <span className={`text-2xl ${attendeesCount === 1 ? 'scale-110' : 'grayscale opacity-50'}`}>👤</span>
                                                                <span className={`text-xs font-bold uppercase tracking-wider ${attendeesCount === 1 ? 'text-emerald-700' : 'text-slate-500'}`}>Solo Yo</span>
                                                            </div>
                                                        </div>

                                                        {/* Opción +1 */}
                                                        <div
                                                            onClick={() => setAttendeesCount(2)}
                                                            className={`relative overflow-hidden rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 ${attendeesCount === 2 ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-slate-100 hover:border-slate-300'}`}
                                                        >
                                                            <div className="flex flex-col items-center gap-2">
                                                                <span className={`text-2xl ${attendeesCount === 2 ? 'scale-110' : 'grayscale opacity-50'}`}>👥</span>
                                                                <span className={`text-xs font-bold uppercase tracking-wider ${attendeesCount === 2 ? 'text-emerald-700' : 'text-slate-500'}`}>+1 Persona</span>
                                                            </div>
                                                            {/* Badge de Cupo */}
                                                            <div className="absolute top-2 right-2">
                                                                <span className="flex h-2 w-2 relative">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invitación Personal (1 Cupo)</p>
                                                </div>
                                            )}

                                            {/* Nombre del Acompañante */}
                                            {attendeesCount > 1 && (
                                                <div className="animate-in fade-in zoom-in-95 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                                                    <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Nombre de tu Acompañante</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Nombre y Apellido"
                                                        value={companionName}
                                                        onChange={(e) => setCompanionName(e.target.value)}
                                                        className="w-full bg-white border border-emerald-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 text-sm transition-colors shadow-sm"
                                                    />
                                                </div>
                                            )}

                                            {/* Notas Adicionales */}
                                            <div>
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notas / Restricciones</label>
                                                <textarea
                                                    rows={2}
                                                    placeholder="¿Alguna alergia o detalle especial?"
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 focus:bg-white text-sm transition-colors resize-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="mb-6 bg-red-50 border border-red-100 p-3 rounded-xl flex items-start gap-3">
                                            <div className="mt-0.5 text-red-500"><X size={14} /></div>
                                            <p className="text-red-600 text-xs font-medium leading-relaxed">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !status}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-sm tracking-[0.2em] uppercase hover:shadow-lg hover:shadow-emerald-200 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        {loading ? 'Procesando...' : 'Confirmar Ahora'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-6 relative z-10">
                                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-100">
                                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <h4 className="font-display text-4xl text-emerald-600 mb-2">
                                        {status === 'confirmed' ? '¡Confirmado!' : 'Gracias'}
                                    </h4>
                                    <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                                        {status === 'confirmed'
                                            ? <>Todo listo <strong>{invitation.first_name}</strong>. Nos vemos el 22 de Febrero.</>
                                            : <>Entendemos tu situación. Gracias por informarnos.</>
                                        }
                                    </p>

                                    {status === 'confirmed' && (
                                        <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 mb-8 flex flex-col items-center">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-4">Tu Código de Acceso QR</p>
                                            <div className="bg-white p-2 rounded-lg border-2 border-slate-100">
                                                <QRCodeSVG
                                                    value={invitation.invite_token}
                                                    size={160}
                                                    level="H"
                                                    fgColor="#059669"
                                                />
                                            </div>
                                            <p className="mt-4 font-mono text-xs text-slate-400 tracking-widest">{invitation.invite_token.slice(0, 8).toUpperCase()}</p>
                                        </div>
                                    )}

                                    <button onClick={() => setShowModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 border-b border-transparent hover:border-slate-300 pb-1 cursor-pointer transition-colors">
                                        CERRAR VENTANA
                                    </button>

                                    <div className="mt-6">
                                        <button
                                            onClick={() => setRsvpStep(1)}
                                            className="text-[10px] text-emerald-500 font-bold hover:text-emerald-700 underline decoration-dotted uppercase tracking-widest"
                                        >
                                            Modificar mi respuesta
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Borde inferior dentado estilo ticket */}
                        <div className="absolute bottom-0 left-0 w-full h-4 bg-[radial-gradient(circle,transparent_60%,#ffffff_60%)] bg-[length:20px_20px] rotate-180 -mb-2"></div>
                    </div>
                </div>
            )}
        </>
    );
}
