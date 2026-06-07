'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { exerciseService, Exercise } from '../../../services/exerciseService';
import { Flame, Clock, Play } from 'lucide-react';

const THUMB_COLORS: Record<number, string> = {
    1: 'bg-[#F9C8CF]',
    2: 'bg-[#B8E8D0]',
    3: 'bg-[#FFE5A0]',
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

// Estados de ánimo con imágenes
const moods = [
    { image: '/bloqueado.png', label: 'Bloqueado' },
    { image: '/tranqui.png', label: 'Tranqui' },
    { image: '/conenergia.png', label: 'Con energía' },
    { image: '/cansado.png', label: 'Cansado' },
];

function SkeletonCard() {
    return (
        <div
            className="bg-white rounded-[22px] overflow-hidden"
            style={{ border: '2.5px solid #1A1A1A', boxShadow: '5px 5px 0px #1A1A1A' }}
        >
            <div className="h-[140px] bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
            </div>
        </div>
    );
}

function ActivityCard({ exercise, onClick }: { exercise: Exercise; onClick: () => void }) {
    const color = THUMB_COLORS[exercise.exerciseTypeId] ?? 'bg-[#D0C0F0]';
    const tag = TYPE_LABELS[exercise.exerciseTypeId] ?? exercise.exerciseType?.type ?? 'Ejercicio';

    // Mapa de imágenes por ID de ejercicio
    const getExerciseImage = (exerciseId: number): string => {
        const images: Record<number, string> = {
            1: '/crazy8.png',
            2: '/scamper.png',
            3: '/estiramiento-de-manos.png',
            4: '/dibujo-a-ciegas.png',
            5: '/mapa-mental.png',
            6: '/pausa-de-ojos.png',
        };
        return images[exerciseId] || '/default-exercise.png';
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-[22px] overflow-hidden cursor-pointer transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none hover:-translate-y-0.5"
            style={{ border: '2.5px solid #1A1A1A', boxShadow: '5px 5px 0px #1A1A1A' }}
        >
            {/* Imagen del ejercicio - tamaño más grande */}
            <div className={`${color} h-[160px] flex items-center justify-center p-3 overflow-hidden`}>
                <img
                    src={getExerciseImage(exercise.id)}
                    alt={exercise.name}
                    className="w-full h-full object-contain transform scale-110"
                />
            </div>
            <div className="p-4" style={{ borderTop: '2px solid #1A1A1A' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#888899' }}>
                    {tag}
                </p>
                <h3 className="font-black text-[#1C1C1C] text-[15px] leading-tight mb-2">{exercise.name}</h3>
                <p className="text-xs font-bold flex items-center gap-1" style={{ color: '#555566' }}>
                    <Clock size={11} /> {exercise.duration} min
                </p>
            </div>
        </div>
    );
}
export default function Feed() {
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Usuario');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [streak, setStreak] = useState(0);

    const fetchStreak = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-history/me/streak`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setStreak(data.streak || 0);
            }
        } catch (error) {
            console.error('Error al cargar la racha:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserName(payload.name || payload.email.split('@')[0]);
            } catch (error) {
                console.error('Error decodificando token:', error);
            }
        }

        const loadExercises = async () => {
            try {
                const data = await exerciseService.getExercises();
                setExercises(data);
                setFilteredExercises(data);
            } catch (error) {
                console.error('Error cargando ejercicios:', error);
            } finally {
                setLoading(false);
            }
        };

        loadExercises();
        fetchStreak();
    }, []);

    useEffect(() => {
        if (!selectedMood || selectedMood === 'Con energía') {
            setFilteredExercises(exercises);
        } else if (selectedMood === 'Bloqueado') {
            setFilteredExercises(exercises.filter((ex) => ex.exerciseTypeId === 1));
        } else if (selectedMood === 'Tranqui') {
            setFilteredExercises(exercises.filter((ex) => ex.exerciseTypeId === 2));
        } else if (selectedMood === 'Cansado') {
            setFilteredExercises(exercises.filter((ex) => ex.duration <= 3));
        } else {
            setFilteredExercises(exercises);
        }
    }, [selectedMood, exercises]);

    const handleSurprise = () => {
        if (exercises.length > 0) {
            const random = exercises[Math.floor(Math.random() * exercises.length)];
            router.push(`/exercises/${random.id}`);
        }
    };

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            <div
                className="w-full min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 pb-28 md:pb-10">
                    {/* HEADER */}
                    <div className="max-w-3xl mx-auto flex items-center justify-between mb-8 gap-4">
                        <div>
                            <h1
                                className="text-[28px] sm:text-[32px] font-black tracking-tight leading-tight"
                                style={{ color: '#1C1C1C' }}
                            >
                                ¿Atascado, {userName}?
                            </h1>
                            <p className="text-[15px] font-semibold mt-0.5" style={{ color: '#6B6660' }}>
                                Eso tiene solución.
                            </p>
                        </div>

                        <div
                            className="bg-white rounded-full px-4 py-2.5 flex items-center gap-3 flex-shrink-0"
                            style={{ border: '2.5px solid #1A1A1A', boxShadow: '4px 4px 0px #1A1A1A' }}
                        >
                            <Flame size={22} color="#FF6B2B" fill="#FF6B2B" />
                            <div className="hidden sm:block">
                                <p className="font-black text-[#1C1C1C] text-sm leading-none">{streak} días seguidos</p>
                                <p className="text-xs font-semibold mt-0.5" style={{ color: '#888' }}>
                                    {streak === 0 ? '¡Empieza hoy!' : '¡Sigue así!'}
                                </p>
                            </div>
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-black text-base"
                                style={{ border: '2px solid #F4A97F', color: '#E8855A' }}
                            >
                                {streak}
                            </div>
                        </div>
                    </div>

                    {/* Divisor */}
                    <div className="max-w-3xl mx-auto mb-8" style={{ borderTop: '1.5px dashed #C8C0B0' }} />

                    {/* CARD MOOD */}
                    <div className="max-w-3xl mx-auto mb-6">
                        <div
                            className="rounded-[22px] p-6 sm:p-8"
                            style={{
                                background: '#1a1a2e',
                                border: '2.5px solid #1A1A1A',
                                boxShadow: '5px 5px 0px #1A1A1A',
                            }}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-[200px] h-[200px] flex-shrink-0 self-start mt-1 overflow-hidden">
                                    <img src="/gotica.png" alt="Meditación" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h2
                                        className="text-[20px] sm:text-[24px] font-black leading-snug mb-1"
                                        style={{ color: '#FFFFFF' }}
                                    >
                                        ¿Dónde está tu bloqueo hoy?
                                    </h2>
                                    <p className="text-[13px] font-semibold mb-4" style={{ color: '#B0B0C0' }}>
                                        Elige lo que más se acerque a lo que sientes
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {moods.map((mood) => (
                                            <button
                                                key={mood.label}
                                                onClick={() => setSelectedMood(mood.label)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-150 hover:-translate-y-0.5 active:scale-95"
                                                style={{
                                                    background:
                                                        selectedMood === mood.label
                                                            ? 'rgba(255,255,255,0.9)'
                                                            : '#2a2a3e',
                                                    border:
                                                        selectedMood === mood.label
                                                            ? '2px solid #1A1A1A'
                                                            : '2px solid #3a3a4e',
                                                    fontWeight: 700,
                                                    fontSize: '13px',
                                                    color: selectedMood === mood.label ? '#3A2E72' : '#FFFFFF',
                                                }}
                                            >
                                                <img
                                                    src={mood.image}
                                                    alt={mood.label}
                                                    className="w-7 h-7 object-contain"
                                                />
                                                {mood.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PAUSA MÁGICA */}
                    <div className="max-w-3xl mx-auto mb-10">
                        <button
                            onClick={handleSurprise}
                            disabled={exercises.length === 0}
                            className="w-full py-[18px] rounded-full text-white text-[17px] font-black transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-1 active:translate-y-1 active:shadow-none"
                            style={{
                                background: '#8B5BDB',
                                border: '2.5px solid #1A1A1A',
                                boxShadow: '5px 5px 0px #1A1A1A',
                            }}
                        >
                            ¡Sorpréndeme!
                        </button>
                    </div>

                    {/* SECCIÓN "PARA TI" */}
                    <div>
                        <h2
                            className="text-[20px] sm:text-[22px] font-black mb-5 text-center sm:text-left"
                            style={{ color: '#1C1C1C' }}
                        >
                            Para ti
                        </h2>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {[1, 2, 3, 4].map((i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : filteredExercises.length === 0 ? (
                            <div
                                className="rounded-[22px] p-8 text-center max-w-3xl mx-auto"
                                style={{
                                    background: '#fff',
                                    border: '2.5px solid #1A1A1A',
                                    boxShadow: '5px 5px 0px #1A1A1A',
                                }}
                            >
                                <p className="text-4xl mb-3">🌱</p>
                                <p className="font-bold" style={{ color: '#555566' }}>
                                    No hay ejercicios para este estado de ánimo
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredExercises.map((exercise) => (
                                    <ActivityCard
                                        key={exercise.id}
                                        exercise={exercise}
                                        onClick={() => router.push(`/exercises/${exercise.id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

