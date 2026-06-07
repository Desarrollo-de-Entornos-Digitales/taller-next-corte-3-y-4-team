'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNotifications } from '@/context/NotificationContext';

export default function FeedbackPage() {
    const { id } = useParams();
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [exerciseName, setExerciseName] = useState('');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const moods = [
        { emoji: '😫', label: 'Sigo bloqueado' },
        { emoji: '😊', label: 'Mejor' },
        { emoji: '😃', label: 'Mucho mejor' },
        { emoji: '😴', label: 'Cansado' },
        { emoji: '⚡', label: 'Con energía' },
    ];

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setExerciseName(data.name);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar el ejercicio', 'error');
            }
        };
        if (id) fetchExercise();
    }, [id, showNotification]);

    const handleMoodSelect = (label: string) => {
        setSelectedMood(label);
        console.log(`Estado de ánimo después del ejercicio: ${label}`);
        showNotification('Gracias por tu feedback', 'success');
    };

    const handleGoToFeed = () => {
        router.push('/feed');
    };

    const handleRepeat = () => {
        router.push(`/exercises/${id}/timer`);
    };

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            {/* Panel principal — card flotante más ancha */}
            <div
                className="w-full max-w-2xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-5 sm:p-6 md:p-8 text-center">
                    {/* Mensaje principal */}
                    <h1 className="text-3xl font-black text-gray-900 mb-2">¡Bien hecho!</h1>
                    <p className="text-gray-500 text-sm mb-6">
                        Has completado <span className="font-extrabold text-gray-800">{exerciseName}</span>
                    </p>

                    {/* Sección de estado de ánimo */}
                    <div className="mb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                            ¿Cómo te sientes ahora?
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 md:flex-nowrap">
                            {moods.map((mood) => (
                                <button
                                    key={mood.label}
                                    onClick={() => handleMoodSelect(mood.label)}
                                    className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl border-2 transition-all flex-1 ${
                                        selectedMood === mood.label
                                            ? 'border-purple-500 bg-purple-100 scale-105'
                                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                    }`}
                                >
                                    <span className="text-2xl">{mood.emoji}</span>
                                    <span className="text-xs font-bold text-gray-600">{mood.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleRepeat}
                            className="w-full py-3.5 rounded-full font-black text-white text-sm bg-purple-600 hover:bg-purple-700 border-2 border-black transition-all hover:-translate-y-0.5 active:translate-y-0"
                            style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                        >
                            Repetir ejercicio
                        </button>
                        <button
                            onClick={handleGoToFeed}
                            className="w-full py-3.5 rounded-full font-black text-sm text-purple-700 bg-white border-2 border-black transition-all hover:-translate-y-0.5 active:translate-y-0"
                            style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                        >
                            Ir al feed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
