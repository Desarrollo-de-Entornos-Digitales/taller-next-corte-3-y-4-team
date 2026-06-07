'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        if (isToday) {
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        }
        return formatDate(dateString);
    };

    const getExerciseEmoji = (type?: string) => {
        const map: Record<string, string> = {
            Ideación: '💡',
            Desbloqueo: '🎨',
            Investigación: '🔍',
            'Pausa activa': '🧘',
        };
        return map[type || ''] || '⚡';
    };

    const getBorderColor = (type?: string) => {
        const map: Record<string, string> = {
            Ideación: '#F59E0B',
            Desbloqueo: '#EF4444',
            Investigación: '#3B82F6',
            'Pausa activa': '#10B981',
        };
        return map[type || ''] || '#8B5BDB';
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
            <div
                className="min-h-screen font-[Nunito,sans-serif] flex items-center justify-center"
                style={{ background: '#8B5BDB' }}
            >
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-semibold">Cargando historial...</p>
                </div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
                <div className="flex items-center justify-between mb-6 w-full max-w-4xl mx-auto px-1">
                    <button
                        onClick={() => router.back()}
                        className="text-white hover:text-purple-200 transition"
                        aria-label="Volver"
                    >
                        <ArrowLeft size={22} strokeWidth={2.5} />
                    </button>
                    <h1 className="text-lg font-black text-white">Mi historial</h1>
                    <div className="w-6" />
                </div>

                <div
                    className="w-full max-w-4xl mx-auto rounded-[28px] overflow-hidden"
                    style={{
                        background: '#F5F1E8',
                        border: '2.5px solid #1A1A1A',
                        boxShadow: '6px 6px 0px #1A1A1A',
                    }}
                >
                    <div className="p-8 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Aún no has realizado ejercicios</h2>
                        <p className="text-gray-500 mb-6">Comienza a explorar y verás tu progreso aquí</p>
                        <button
                            onClick={() => router.push('/feed')}
                            className="px-6 py-3 rounded-full font-black text-white bg-purple-600 border-2 border-black transition-all hover:-translate-y-0.5 active:translate-y-0"
                            style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                        >
                            Explorar ejercicios
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const groupedHistory = groupByDate();

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            {/* Header con flecha de retroceso */}
            <div className="flex items-center justify-between mb-6 w-full max-w-4xl mx-auto px-1">
                <button
                    onClick={() => router.back()}
                    className="text-white hover:text-purple-200 transition"
                    aria-label="Volver"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-black text-white">Mi historial</h1>
                <div className="w-6" />
            </div>

            {/* Panel principal — card flotante */}
            <div
                className="w-full max-w-4xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-6 sm:p-8">
                    <p className="text-gray-500 mb-6">
                        Has completado <span className="font-bold text-gray-800">{history.length}</span> ejercicios en
                        total
                    </p>

                    <div className="space-y-6">
                        {Object.entries(groupedHistory).map(([date, items]) => (
                            <div key={date}>
                                <h2 className="text-lg font-black mb-3" style={{ color: '#2A2060' }}>
                                    {formatDate(items[0].completedAt)}
                                </h2>
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => router.push(`/exercises/${item.exerciseId}`)}
                                            className="bg-white rounded-2xl p-4 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 flex items-center gap-4"
                                            style={{
                                                border: '1px solid #E5E7EB',
                                                borderLeft: `4px solid ${getBorderColor(item.exercise?.exerciseType?.type)}`,
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                            }}
                                        >
                                            {/* Icono */}
                                            <div className="text-2xl w-10 h-10 flex items-center justify-center flex-shrink-0">
                                                {getExerciseEmoji(item.exercise?.exerciseType?.type)}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-1">
                                                    <h3 className="font-bold text-gray-900 truncate">
                                                        {item.exercise?.name || `Ejercicio #${item.exerciseId}`}
                                                    </h3>
                                                    <span className="text-sm text-gray-400 font-normal whitespace-nowrap">
                                                        ({item.exercise?.duration || '?'} min)
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {item.exercise?.exerciseType?.type || 'Ejercicio'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                    🕐 Completado: {formatTime(item.completedAt)}
                                                </p>
                                            </div>

                                            {/* Botón */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/exercises/${item.exerciseId}/timer`);
                                                }}
                                                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:bg-gray-50 whitespace-nowrap flex-shrink-0"
                                                style={{
                                                    color: '#374151',
                                                    border: '1px solid #D1D5DB',
                                                    background: 'white',
                                                }}
                                            >
                                                Volver a hacer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
