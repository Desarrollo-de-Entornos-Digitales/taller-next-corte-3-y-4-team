'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useNotifications } from '@/context/NotificationContext';

interface ExerciseHistory {
    id: number;
    exerciseId: number;
    completedAt: string;
    exercise?: {
        id: number;
        name: string;
        duration: number;
        exerciseType?: { type: string };
    };
}

export default function HistoryPage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [history, setHistory] = useState<ExerciseHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const userId = JSON.parse(atob(token.split('.')[1])).sub;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-history/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar el historial');
                }

                let data = await response.json();

                // Asegurar que sea un array
                if (data && !Array.isArray(data)) {
                    data = data.data || [];
                }

                setHistory(data);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar el historial', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [router, showNotification]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const groupByDate = () => {
        const groups: { [key: string]: ExerciseHistory[] } = {};
        history.forEach((item) => {
            const date = new Date(item.completedAt).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(item);
        });
        return groups;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Cargando historial...</p>
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Aún no has realizado ejercicios</h2>
                    <p className="text-gray-500 mb-6">Comienza a explorar y verás tu progreso aquí</p>
                    <button
                        onClick={() => router.push('/feed')}
                        className="px-6 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
                    >
                        Explorar ejercicios
                    </button>
                </div>
            </div>
        );
    }

    const groupedHistory = groupByDate();

    return (
        <div className="min-h-screen bg-[#EDE8DC] py-10 px-5">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Historial</h1>
                <p className="text-gray-500 mb-6">Has completado {history.length} ejercicios en total</p>

                <div className="space-y-6">
                    {Object.entries(groupedHistory).map(([date, items]) => (
                        <div key={date}>
                            <h2 className="text-lg font-semibold text-purple-700 mb-3">
                                {formatDate(items[0].completedAt)}
                            </h2>
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => router.push(`/exercises/${item.exerciseId}`)}
                                        className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {item.exercise?.name || `Ejercicio #${item.exerciseId}`}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Duración: {item.exercise?.duration || '?'} min
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/exercises/${item.exerciseId}/timer`);
                                                }}
                                                className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold hover:bg-purple-200 transition"
                                            >
                                                Repetir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
