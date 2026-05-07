'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/Header';
import { exerciseService, Exercise } from '../../../services/exerciseService';

const THUMB_COLORS: Record<number, string> = {
    1: 'bg-[#F5B8C0]',
    2: 'bg-[#B8E8D0]',
    3: 'bg-[#F5DFA0]',
};

const THUMB_EMOJIS: Record<number, string> = {
    1: '🎨',
    2: '💡',
    3: '🧘',
};

const TYPE_LABELS: Record<number, string> = {
    1: 'Gimnasia creativa',
    2: 'Enfoque mental',
    3: 'Pausa activa',
};

const moods = [
    { emoji: '😫', label: 'Bloqueado' },
    { emoji: '😴', label: 'Sin energía' },
    { emoji: '⚡', label: 'Con energía' },
    { emoji: '😖', label: 'Tenso' },
    { emoji: '😊', label: 'Cansado' },
];

function SkeletonCard() {
    return (
        <div
            className="bg-white rounded-[22px] overflow-hidden"
            style={{ border: '2.5px solid #1A1A1A', boxShadow: '5px 5px 0px #1A1A1A' }}
        >
            <div className="h-[100px] bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
}

function ActivityCard({ exercise, onClick, delay = 0 }: { exercise: Exercise; onClick: () => void; delay?: number }) {
    const color = THUMB_COLORS[exercise.exerciseTypeId] ?? 'bg-[#D0C0F0]';
    const emoji = THUMB_EMOJIS[exercise.exerciseTypeId] ?? '✨';
    const tag = TYPE_LABELS[exercise.exerciseTypeId] ?? exercise.exerciseType?.type ?? 'Ejercicio';

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-[22px] overflow-hidden cursor-pointer transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
            style={{
                border: '2.5px solid #1A1A1A',
                boxShadow: '5px 5px 0px #1A1A1A',
                animationDelay: `${delay}ms`,
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translate(-2px,-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '7px 7px 0px #1A1A1A';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translate(0,0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '5px 5px 0px #1A1A1A';
            }}
        >
            <div className={`${color} h-[100px] flex items-center px-5 relative`}>
                <span className="text-5xl">{emoji}</span>
                <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-sm"
                    style={{ border: '2px solid #1A1A1A', boxShadow: '2px 2px 0px #1A1A1A' }}
                >
                    ▶️
                </div>
            </div>
            <div className="p-4">
                <p
                    className="text-[11px] font-bold uppercase tracking-wide mb-1"
                    style={{ color: '#888899', letterSpacing: '0.5px' }}
                >
                    {tag}
                </p>
                <h3 className="font-black text-[#1C1C1C] text-[17px] leading-tight mb-1">{exercise.name}</h3>
                <p className="text-[13px] font-bold" style={{ color: '#555566' }}>
                    {exercise.duration} min
                </p>
            </div>
        </div>
    );
}

export default function Feed() {
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Usuario');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserName(payload.name || payload.email.split('@')[0]);
        }

        const loadExercises = async () => {
            try {
                const data = await exerciseService.getExercises();
                setExercises(data);
            } catch (error) {
                console.error('Error cargando ejercicios:', error);
            } finally {
                setLoading(false);
            }
        };

        loadExercises();
    }, []);

    const handleSurprise = () => {
        if (exercises.length > 0) {
            const random = exercises[Math.floor(Math.random() * exercises.length)];
            router.push(`/exercises/${random.id}`);
        }
    };

    return (
        <div className="min-h-screen font-[Nunito,sans-serif]" style={{ background: '#EDE8DC' }}>
            <Header />

            <div className="max-w-2xl mx-auto px-5 pt-10 pb-28 md:pb-16">
                {/* ── Saludo ── */}
                <div className="mb-7">
                    <h1 className="text-[32px] font-black tracking-tight" style={{ color: '#1C1C1C' }}>
                        ¡Hola, {userName}!
                    </h1>
                </div>

                {/* ── Mood card (expandida a todo el ancho en desktop) ── */}
                <div
                    className="rounded-[22px] p-6 sm:p-8 mb-5 relative overflow-hidden w-full"
                    style={{
                        background: 'linear-gradient(135deg, #C2D8F0 0%, #C8C2EA 55%, #C4B8E8 100%)',
                        border: '2.5px solid #1A1A1A',
                        boxShadow: '5px 5px 0px #1A1A1A',
                    }}
                >
                    {/* Fila superior: icono + texto */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="w-[68px] h-[68px] sm:w-[90px] sm:h-[90px] rounded-full bg-white/50 flex items-center justify-center text-[42px] sm:text-[56px] flex-shrink-0">
                            🧘
                        </div>
                        <div className="text-center sm:text-left">
                            <h2
                                className="text-[19px] sm:text-[24px] font-black leading-snug"
                                style={{ color: '#2A2060' }}
                            >
                                ¿Cómo te sientes hoy?
                            </h2>
                            <p className="text-[13px] sm:text-[16px] font-semibold mt-1" style={{ color: '#5A4E8A' }}>
                                Elige una opción para empezar
                            </p>
                        </div>
                    </div>

                    {/* Emojis horizontales - distribuidos uniformemente en desktop */}
                    <div className="flex flex-wrap justify-center sm:justify-between gap-4 sm:gap-2">
                        {moods.map((mood) => (
                            <button
                                key={mood.label}
                                onClick={() => {
                                    setSelectedMood(mood.label);
                                    console.log(`Estado emocional: ${mood.label}`);
                                }}
                                className="flex flex-col items-center gap-2 transition-transform duration-150 hover:-translate-y-1 active:scale-95"
                                style={{ flex: '1 0 auto', minWidth: '70px' }}
                            >
                                <span
                                    className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full flex items-center justify-center text-[28px] sm:text-[38px] transition-colors duration-150 mx-auto"
                                    style={{
                                        background:
                                            selectedMood === mood.label
                                                ? 'rgba(255,255,255,0.9)'
                                                : 'rgba(255,255,255,0.55)',
                                    }}
                                >
                                    {mood.emoji}
                                </span>
                                <span
                                    className="text-[10px] sm:text-[13px] font-extrabold text-center"
                                    style={{ color: '#3A2E72' }}
                                >
                                    {mood.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                {/* ── Pausa mágica ── */}
                <div className="mb-7">
                    <p
                        className="text-[11px] font-extrabold uppercase tracking-[2px] mb-2.5"
                        style={{ color: '#B8A838' }}
                    >
                        ✨ Pausa mágica
                    </p>
                    <button
                        onClick={handleSurprise}
                        disabled={exercises.length === 0}
                        className="w-full py-[18px] rounded-full text-white text-[17px] font-black transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-1 active:translate-y-1 active:shadow-none"
                        style={{
                            background: '#8B5BDB',
                            border: '2.5px solid #1A1A1A',
                            boxShadow: '5px 5px 0px #1A1A1A',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translate(-2px,-2px)';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '7px 7px 0px #1A1A1A';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translate(0,0)';
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '5px 5px 0px #1A1A1A';
                        }}
                    >
                        ¡Sorpréndeme! ✨
                    </button>
                </div>

                {/* ── Para ti ── */}
                <div>
                    <h2 className="text-[20px] font-black mb-4" style={{ color: '#1C1C1C' }}>
                        Para ti
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-2 gap-4">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    ) : exercises.length === 0 ? (
                        <div
                            className="rounded-[22px] p-8 text-center"
                            style={{
                                background: '#fff',
                                border: '2.5px solid #1A1A1A',
                                boxShadow: '5px 5px 0px #1A1A1A',
                            }}
                        >
                            <p className="text-4xl mb-3">🌱</p>
                            <p className="font-bold text-[#555566]">No hay ejercicios disponibles aún</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {exercises.slice(0, 4).map((exercise, i) => (
                                <ActivityCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    delay={i * 80}
                                    onClick={() => router.push(`/exercises/${exercise.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}