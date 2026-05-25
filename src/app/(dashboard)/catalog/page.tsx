'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function CatalogPage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const exercisesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const exercisesRaw: unknown = await exercisesRes.json();
                let exercisesData: Exercise[] = [];
                if (exercisesRaw && !Array.isArray(exercisesRaw)) {
                    exercisesData = (exercisesRaw as { data: Exercise[] }).data || [];
                } else if (Array.isArray(exercisesRaw)) {
                    exercisesData = exercisesRaw as Exercise[];
                }
                setExercises(exercisesData);

                const typesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-types`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const typesRaw: unknown = await typesRes.json();
                let typesData: ExerciseType[] = [];
                if (typesRaw && !Array.isArray(typesRaw)) {
                    typesData = (typesRaw as { data: ExerciseType[] }).data || [];
                } else if (Array.isArray(typesRaw)) {
                    typesData = typesRaw as ExerciseType[];
                }
                setExerciseTypes(typesData);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar el catálogo', 'error');
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [router, showNotification]);

    const filteredExercises = useMemo(() => {
        let filtered = [...exercises];

        if (searchTerm) {
            filtered = filtered.filter((ex) => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (selectedType) {
            filtered = filtered.filter((ex) => ex.exerciseType?.type === selectedType);
        }

        return filtered;
    }, [searchTerm, selectedType, exercises]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Cargando catálogo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EDE8DC] py-10 px-5">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Ejercicios</h1>
                <p className="text-gray-500 mb-6">{filteredExercises.length} ejercicios disponibles</p>

                {/* Barra de búsqueda y filtros */}
                <div className="mb-8 space-y-4">
                    <input
                        type="text"
                        placeholder="🔍 Buscar ejercicio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-3 rounded-full border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition bg-white"
                    />

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedType('')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                selectedType === ''
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            Todos
                        </button>
                        {exerciseTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.type)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                    selectedType === type.type
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                {type.type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid de ejercicios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredExercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            onClick={() => router.push(`/exercises/${exercise.id}`)}
                            className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition hover:-translate-y-1"
                        >
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{exercise.name}</h3>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{exercise.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">⏱️ {exercise.duration} min</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                                    {exercise.exerciseType?.type || 'Ejercicio'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredExercises.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No se encontraron ejercicios</p>
                    </div>
                )}
            </div>
        </div>
    );
}
