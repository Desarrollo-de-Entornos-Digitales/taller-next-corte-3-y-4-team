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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchTerm, setSearchTerm] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedType, setSelectedType] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Cargar ejercicios
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

                // Cargar tipos de ejercicio
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

                {/* Filtros*/}
                <div className="text-center py-10">
                    <p className="text-gray-400">Próximamente: filtros y lista de ejercicios</p>
                </div>
            </div>
        </div>
    );
}
