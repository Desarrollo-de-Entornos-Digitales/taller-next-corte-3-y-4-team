'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/Header';
import { exerciseService, Exercise } from '../../../services/exerciseService';

export default function Feed() {
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Usuario');

    const moods = [
        { emoji: '😫', label: 'Bloqueado' },
        { emoji: '😴', label: 'Sin energía' },
        { emoji: '⚡', label: 'Con energía' },
        { emoji: '😖', label: 'Tenso' },
        { emoji: '😊', label: 'Cansado' },
    ];

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
            } catch (error) {
                console.error('Error cargando ejercicios:', error);
            } finally {
                setLoading(false);
            }
        };

        loadExercises();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="max-w-6xl mx-auto p-6">
                {/* Header con saludo */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">¡Hola, {userName}! 👋</h1>
                    <p className="text-gray-600">¿Qué necesitas hoy?</p>
                </div>

                {/* MoodSelector */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">¿Cómo te sientes hoy?</h2>
                    <div className="flex gap-4 justify-around flex-wrap">
                        {moods.map((mood) => (
                            <button
                                key={mood.label}
                                onClick={() => console.log(`Estado emocional: ${mood.label}`)}
                                className="flex flex-col items-center gap-1"
                            >
                                <span className="text-3xl p-3 bg-gray-100 rounded-full hover:bg-green-100 transition">
                                    {mood.emoji}
                                </span>
                                <span className="text-xs text-gray-600">{mood.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Botón Pausa mágica */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
                    <p className="text-sm opacity-90">✨ PAUSA MÁGICA</p>
                    <button
                        onClick={() => {
                            if (exercises.length > 0) {
                                const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
                                router.push(`/exercises/${randomExercise.id}`);
                            }
                        }}
                        className="mt-2 bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
                    >
                        ¡Sorpréndeme!
                    </button>
                </div>

                {/* Sección "Para ti" */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Para ti</h2>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-xl shadow p-4">
                                    <div className="h-32 bg-gray-100 rounded-lg mb-2 animate-pulse" />
                                    <p className="font-semibold text-gray-900">Ejercicio {i}</p>
                                    <p className="text-sm text-gray-500">Cargando...</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {exercises.slice(0, 3).map((exercise) => (
                                <div
                                    key={exercise.id}
                                    className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer"
                                    onClick={() => router.push(`/exercises/${exercise.id}`)}
                                >
                                    <div className="text-4xl mb-2">
                                        {exercise.exerciseTypeId === 1 && '🎨'}
                                        {exercise.exerciseTypeId === 2 && '💡'}
                                        {exercise.exerciseTypeId === 3 && '🧘'}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{exercise.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{exercise.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">⏱️ {exercise.duration} min</span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                            {exercise.exerciseType?.type || 'Ejercicio'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
