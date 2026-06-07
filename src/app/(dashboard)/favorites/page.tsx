'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface Favorite {
    id: number;
    exerciseId: number;
    exercise?: {
        id: number;
        name: string;
        description: string;
        duration: number;
        exerciseType?: { type: string };
    };
}

interface JwtPayload {
    sub: number;
    email: string;
    name: string;
}

// Mapa de colores por tipo (mismo que el feed)
const getTypeColor = (type?: string): string => {
    const map: Record<string, string> = {
        Ideación: '#B8E8D0',
        Desbloqueo: '#F9C8CF',
        'Pausa activa': '#FFE5A0',
        Investigación: '#D0C0F0',
    };
    return map[type || ''] || '#D0C0F0';
};

// Mapa de emojis por tipo
const getExerciseEmoji = (type?: string): string => {
    const map: Record<string, string> = {
        Ideación: '💡',
        Desbloqueo: '🎨',
        Investigación: '🔍',
        'Pausa activa': '🧘',
    };
    return map[type || ''] || '✨';
};

export default function FavoritesPage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
                const userId = payload.sub;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar favoritos');
                }

                const data: unknown = await response.json();

                let favoritesArray: Favorite[] = [];
                if (data && !Array.isArray(data)) {
                    favoritesArray = (data as { data: Favorite[] }).data || [];
                } else if (Array.isArray(data)) {
                    favoritesArray = data as Favorite[];
                }

                setFavorites(favoritesArray);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar favoritos', 'error');
            } finally {
                setLoading(false);
            }
        };

        void fetchFavorites();
    }, [router, showNotification]);

    const removeFavorite = async (favoriteId: number, exerciseId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
            const userId = payload.sub;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${userId}/exercise/${exerciseId}`,
                { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
            );

            if (response.ok) {
                setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
                showNotification('Ejercicio eliminado de favoritos', 'success');
            } else {
                throw new Error('Error al eliminar');
            }
        } catch (error) {
            console.error(error);
            showNotification('Error al eliminar de favoritos', 'error');
        }
    };

    if (loading) {
        return (
            <div
                className="min-h-screen font-[Nunito,sans-serif] flex items-center justify-center"
                style={{ background: '#8B5BDB' }}
            >
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-semibold">Cargando favoritos...</p>
                </div>
            </div>
        );
    }

    if (favorites.length === 0) {
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
                    <h1 className="text-lg font-black text-white">Mis favoritos</h1>
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
                        <div className="text-6xl mb-4">⭐</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes favoritos</h2>
                        <p className="text-gray-500 mb-6">Guarda tus ejercicios favoritos para acceder rápidamente</p>
                        <button
                            onClick={() => router.push('/catalog')}
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

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            {/* Header con flecha de retroceso */}
            <div className="flex items-center justify-between mb-6 w-full max-w-7xl mx-auto px-1">
                <button
                    onClick={() => router.back()}
                    className="text-white hover:text-purple-200 transition"
                    aria-label="Volver"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-black text-white">Mis favoritos</h1>
                <div className="w-6" />
            </div>

            {/* Panel principal — card flotante */}
            <div
                className="w-full max-w-7xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-6 sm:p-8">
                    <p className="text-gray-500 mb-6">{favorites.length} ejercicios guardados</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {favorites.map((fav) => {
                            const typeColor = getTypeColor(fav.exercise?.exerciseType?.type);
                            const emoji = getExerciseEmoji(fav.exercise?.exerciseType?.type);

                            return (
                                <div
                                    key={fav.id}
                                    className="bg-white rounded-[22px] overflow-hidden transition-all duration-150 hover:-translate-y-0.5 group"
                                    style={{
                                        border: '2.5px solid #1A1A1A',
                                        boxShadow: '5px 5px 0px #1A1A1A',
                                    }}
                                >
                                    <div
                                        onClick={() => router.push(`/exercises/${fav.exerciseId}`)}
                                        className="cursor-pointer p-5"
                                    >
                                        {/* Icono en círculo con color de fondo del tipo */}
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                                            style={{ backgroundColor: `${typeColor}40` }}
                                        >
                                            <span className="text-2xl">{emoji}</span>
                                        </div>

                                        {/* Título */}
                                        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">
                                            {fav.exercise?.name || `Ejercicio #${fav.exerciseId}`}
                                        </h3>

                                        {/* Descripción */}
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                                            {fav.exercise?.description || 'Sin descripción'}
                                        </p>

                                        {/* Fila: duración + tag tipo */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400 flex items-center gap-1">
                                                🕐 {fav.exercise?.duration || '?'} min
                                            </span>
                                            <span
                                                className="text-xs px-2 py-1 rounded-full font-black"
                                                style={{
                                                    background: typeColor,
                                                    color: '#1A1A1A',
                                                    border: '1.5px solid #1A1A1A',
                                                }}
                                            >
                                                {fav.exercise?.exerciseType?.type || 'Ejercicio'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botón eliminar */}
                                    <button
                                        onClick={() => {
                                            void removeFavorite(fav.id, fav.exerciseId);
                                        }}
                                        className="w-full py-3 flex items-center justify-center gap-2 font-black text-sm transition-all hover:bg-red-50"
                                        style={{
                                            borderTop: '2px solid #1A1A1A',
                                            color: '#EF4444',
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        Eliminar de favoritos
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
