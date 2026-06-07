'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface Exercise {
    id: number;
    name: string;
    description: string;
    duration: number;
    exerciseTypeId: number;
    exerciseType?: { id: number; type: string };
}

interface ExerciseType {
    id: number;
    type: string;
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

const getExerciseEmoji = (type?: string): string => {
    const map: Record<string, string> = {
        Ideación: '💡',
        Desbloqueo: '🎨',
        Investigación: '🔍',
        'Pausa activa': '🧘',
    };
    return map[type || ''] || '✨';
};

export default function CatalogPage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('');
    const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchExercises = useCallback(
        async (currentPage: number, append: boolean = false) => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/exercises?page=${currentPage}&limit=9`,
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                const data = await response.json();

                let exercisesData = [];
                let totalCount = 0;

                if (data.data && Array.isArray(data.data)) {
                    exercisesData = data.data;
                    totalCount = data.total || 0;
                } else if (Array.isArray(data)) {
                    exercisesData = data;
                    totalCount = data.length;
                } else {
                    exercisesData = [];
                }

                setTotal(totalCount);

                if (append) {
                    setExercises((prev) => [...prev, ...exercisesData]);
                } else {
                    setExercises(exercisesData);
                }

                setHasMore(currentPage * 9 < totalCount);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar ejercicios', 'error');
            }
        },
        [showNotification],
    );

    const fetchTypesAndFavorites = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = JSON.parse(atob(token!.split('.')[1])).sub;

            const [typesRes, favRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-types`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            let typesData = await typesRes.json();
            typesData = Array.isArray(typesData) ? typesData : typesData.data || [];
            setExerciseTypes(typesData);

            let favData = await favRes.json();
            favData = Array.isArray(favData) ? favData : favData.data || [];
            const favSet = new Set(favData.map((fav: any) => fav.exerciseId));
            setFavorites(favSet);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchExercises(1, false), fetchTypesAndFavorites()]);
            setLoading(false);
        };
        init();
    }, []);

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        await fetchExercises(nextPage, true);
        setPage(nextPage);
        setLoadingMore(false);
    };

    const toggleFavorite = async (e: React.MouseEvent, exerciseId: number) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            const userId = JSON.parse(atob(token!.split('.')[1])).sub;

            if (favorites.has(exerciseId)) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${userId}/exercise/${exerciseId}`,
                    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
                );
                if (response.ok) {
                    setFavorites((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(exerciseId);
                        return newSet;
                    });
                    showNotification('Eliminado de favoritos', 'success');
                }
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId, exerciseId }),
                });
                if (response.ok) {
                    setFavorites((prev) => new Set(prev).add(exerciseId));
                    showNotification('Agregado a favoritos', 'success');
                }
            }
        } catch (error) {
            showNotification('Error al actualizar favoritos', 'error');
        }
    };

    const filteredExercises = useMemo(() => {
        let filtered = [...exercises];
        if (selectedType) {
            filtered = filtered.filter((ex) => ex.exerciseType?.type === selectedType);
        }
        return filtered;
    }, [selectedType, exercises]);

    if (loading && exercises.length === 0) {
        return (
            <div
                className="min-h-screen font-[Nunito,sans-serif] flex items-center justify-center"
                style={{ background: '#8B5BDB' }}
            >
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-semibold">Cargando catálogo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            <div className="flex items-center justify-between mb-6 w-full max-w-7xl mx-auto px-1">
                <button onClick={() => router.back()} className="text-white hover:text-purple-200 transition">
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-black text-white">Catálogo de ejercicios</h1>
                <div className="w-6" />
            </div>

            <div
                className="w-full max-w-7xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-6 sm:p-8">
                    <p className="text-gray-500 mb-6">{total} ejercicios disponibles</p>

                    {/* Filtros por tipo */}
                    <div className="mb-8 flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedType('')}
                            className={`px-4 py-2 rounded-full text-sm font-black transition-all ${
                                selectedType === ''
                                    ? 'text-white'
                                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100'
                            }`}
                            style={{
                                background: selectedType === '' ? '#8B5BDB' : 'white',
                                border: selectedType === '' ? '2px solid #1A1A1A' : '2px solid #E5E7EB',
                                boxShadow: selectedType === '' ? '2px 2px 0px #1A1A1A' : 'none',
                            }}
                        >
                            Todos
                        </button>
                        {exerciseTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.type)}
                                className={`px-4 py-2 rounded-full text-sm font-black transition-all ${
                                    selectedType === type.type
                                        ? 'text-white'
                                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100'
                                }`}
                                style={{
                                    background: selectedType === type.type ? '#8B5BDB' : 'white',
                                    border: selectedType === type.type ? '2px solid #1A1A1A' : '2px solid #E5E7EB',
                                    boxShadow: selectedType === type.type ? '2px 2px 0px #1A1A1A' : 'none',
                                }}
                            >
                                {type.type}
                            </button>
                        ))}
                    </div>

                    {/* Grid de ejercicios */}
                    {filteredExercises.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 font-semibold">No se encontraron ejercicios</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredExercises.map((exercise) => {
                                    const isFavorite = favorites.has(exercise.id);
                                    const emoji = getExerciseEmoji(exercise.exerciseType?.type);
                                    const typeColor = getTypeColor(exercise.exerciseType?.type);

                                    return (
                                        <div
                                            key={exercise.id}
                                            onClick={() => router.push(`/exercises/${exercise.id}`)}
                                            className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md relative group"
                                            style={{
                                                border: '1px solid #F0EEE8',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                            }}
                                        >
                                            <button
                                                onClick={(e) => toggleFavorite(e, exercise.id)}
                                                className="absolute top-4 right-4 z-10 transition-all hover:scale-110"
                                            >
                                                <Heart
                                                    size={18}
                                                    className={isFavorite ? 'text-red-500' : 'text-gray-300'}
                                                    fill={isFavorite ? 'currentColor' : 'none'}
                                                />
                                            </button>

                                            <div className="p-5">
                                                <div
                                                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                                                    style={{ backgroundColor: `${typeColor}40` }}
                                                >
                                                    <span className="text-2xl">{emoji}</span>
                                                </div>

                                                <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">
                                                    {exercise.name}
                                                </h3>

                                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                                                    {exercise.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-400 flex items-center gap-1">
                                                        🕐 {exercise.duration} min
                                                    </span>
                                                    <span
                                                        className="text-xs px-2 py-1 rounded-full font-black"
                                                        style={{
                                                            background: typeColor,
                                                            color: '#1A1A1A',
                                                            border: '1.5px solid #1A1A1A',
                                                        }}
                                                    >
                                                        {exercise.exerciseType?.type || 'Ejercicio'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Botón cargar más */}
                            {hasMore && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="px-6 py-3 rounded-full font-black text-white bg-purple-600 border-2 border-black transition-all hover:-translate-y-0.5 disabled:opacity-50"
                                        style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                                    >
                                        {loadingMore ? 'Cargando...' : 'Cargar más ejercicios'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
