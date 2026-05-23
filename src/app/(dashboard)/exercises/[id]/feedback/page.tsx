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
        <div className="min-h-screen bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center p-5">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                {/* Icono de celebración */}
                <div className="text-7xl mb-4">🎉✨</div>

                {/* Mensaje principal */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bien hecho!</h1>
                <p className="text-gray-600 mb-6">
                    Has completado <span className="font-bold">{exerciseName}</span>
                </p>

                {/* Sección de estado de ánimo */}
                <div className="mb-8">
                    <p className="text-sm text-gray-500 mb-3">¿Cómo te sientes ahora?</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {moods.map((mood) => (
                            <button
                                key={mood.label}
                                onClick={() => handleMoodSelect(mood.label)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                                    selectedMood === mood.label ? 'bg-green-100 scale-105' : 'hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-3xl">{mood.emoji}</span>
                                <span className="text-xs text-gray-600">{mood.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleRepeat}
                        className="w-full py-3 rounded-full font-bold text-white bg-purple-600 hover:bg-purple-700 transition shadow-md"
                    >
                        🔄 Repetir ejercicio
                    </button>
                    <button
                        onClick={handleGoToFeed}
                        className="w-full py-3 rounded-full font-bold text-purple-700 bg-white border-2 border-purple-600 hover:bg-purple-50 transition"
                    >
                        🏠 Ir al feed
                    </button>
                </div>

                {/* Mensaje adicional */}
                <p className="text-xs text-gray-400 mt-6">Tu constancia te acerca a nuevos logros</p>
            </div>
        </div>
    );
}
