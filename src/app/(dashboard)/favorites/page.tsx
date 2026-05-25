'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Cargando favoritos...</p>
                </div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⭐</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes favoritos</h2>
                    <p className="text-gray-500 mb-6">Guarda tus ejercicios favoritos para acceder rápidamente</p>
                    <button
                        onClick={() => router.push('/catalog')}
                        className="px-6 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
                    >
                        Explorar ejercicios
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EDE8DC] py-10 px-5">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Favoritos</h1>
                <p className="text-gray-500 mb-6">{favorites.length} ejercicios guardados</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((fav) => (
                        <div
                            key={fav.id}
                            className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition"
                        >
                            <div onClick={() => router.push(`/exercises/${fav.exerciseId}`)} className="cursor-pointer">
                                <h3 className="font-bold text-gray-900 text-lg mb-1">
                                    {fav.exercise?.name || `Ejercicio #${fav.exerciseId}`}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                    {fav.exercise?.description || 'Sin descripción'}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        ⏱️ {fav.exercise?.duration || '?'} min
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                                        {fav.exercise?.exerciseType?.type || 'Ejercicio'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    void removeFavorite(fav.id, fav.exerciseId);
                                }}
                                className="mt-3 w-full py-2 rounded-full text-red-600 border border-red-300 hover:bg-red-50 transition text-sm font-medium"
                            >
                                Eliminar de favoritos
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
