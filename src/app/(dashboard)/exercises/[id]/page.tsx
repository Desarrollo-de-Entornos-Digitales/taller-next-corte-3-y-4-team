'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNotifications } from '@/context/NotificationContext';

interface Exercise {
    id: number;
    name: string;
    description: string;
    duration: number;
    exerciseTypeId: number;
    exerciseType?: {
        id: number;
        type: string;
    };
}

export default function ExerciseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar el ejercicio');
                }

                const data = await response.json();
                setExercise(data);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar el ejercicio', 'error');
                router.push('/feed');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchExercise();
        }
    }, [id, router, showNotification]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Cargando ejercicio...</p>
                </div>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <p className="text-gray-500">Ejercicio no encontrado</p>
            </div>
        );
    }

    const handleStart = () => {
        router.push(`/exercises/${exercise.id}/timer`);
    };

    return (
        <div className="min-h-screen bg-[#EDE8DC] py-10 px-5">
            <div className="max-w-2xl mx-auto">
                {/* Botón volver */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition"
                >
                    ← Volver
                </button>

                {/* Card principal */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-black">
                    {/* Tipo */}
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-purple-100 text-purple-700">
                        {exercise.exerciseType?.type || 'Ejercicio'}
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{exercise.name}</h1>

                    {/* Duración */}
                    <div className="flex items-center gap-2 text-gray-500 mb-6">
                        <span>⏱️</span>
                        <span>{exercise.duration} minutos</span>
                    </div>

                    {/* Descripción */}
                    <p className="text-gray-700 mb-8 leading-relaxed">{exercise.description}</p>

                    {/* Botón comenzar */}
                    <button
                        onClick={handleStart}
                        className="w-full py-4 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition shadow-md"
                    >
                        Comenzar ahora
                    </button>
                </div>
            </div>
        </div>
    );
}
