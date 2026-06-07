'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Dumbbell, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface ExerciseType {
    id: number;
    type: string;
}

interface Exercise {
    id: number;
    name: string;
    description: string;
    duration: number;
    exerciseTypeId: number;
    exerciseType?: ExerciseType;
    createdBy?: string;
    instructions?: string[];
}

export default function AdminExercisesPage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: 5,
        exerciseTypeId: 1,
        instructions: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Cargar ejercicios
            const exercisesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let exercisesData = await exercisesRes.json();
            if (exercisesData && !Array.isArray(exercisesData)) {
                exercisesData = exercisesData.data || [];
            }
            setExercises(exercisesData);

            // Cargar tipos de ejercicio
            const typesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-types`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let typesData = await typesRes.json();
            if (typesData && !Array.isArray(typesData)) {
                typesData = typesData.data || [];
            }
            setExerciseTypes(typesData);
        } catch (error) {
            console.error(error);
            showNotification('Error al cargar datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingExercise(null);
        setFormData({
            name: '',
            description: '',
            duration: 5,
            exerciseTypeId: exerciseTypes[0]?.id || 1,
            instructions: '',
        });
        setShowModal(true);
    };

    const handleEdit = (exercise: Exercise) => {
        setEditingExercise(exercise);
        setFormData({
            name: exercise.name,
            description: exercise.description,
            duration: exercise.duration,
            exerciseTypeId: exercise.exerciseTypeId,
            instructions: Array.isArray(exercise.instructions)
                ? exercise.instructions.join('\n')
                : exercise.instructions || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (exercise: Exercise) => {
        if (!confirm(`¿Eliminar el ejercicio "${exercise.name}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/${exercise.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                showNotification(`Ejercicio "${exercise.name}" eliminado`, 'success');
                fetchData();
            } else {
                throw new Error();
            }
        } catch {
            showNotification('Error al eliminar ejercicio', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || formData.duration <= 0) {
            showNotification('Completa todos los campos correctamente', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = editingExercise
                ? `${process.env.NEXT_PUBLIC_API_URL}/exercises/${editingExercise.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/exercises`;

            const method = editingExercise ? 'PUT' : 'POST';

            const instructionsText = formData.instructions.trim() || null;

            const payload = {
                name: formData.name,
                description: formData.description,
                duration: formData.duration,
                exerciseTypeId: formData.exerciseTypeId,
                instructions: instructionsText,
                createdBy: 'admin',
            };

            console.log('📤 Enviando ejercicio:', JSON.stringify(payload, null, 2));

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            console.log('📡 Status:', response.status);
            console.log('📡 OK?', response.ok);

            const responseText = await response.text();
            console.log('📡 Respuesta raw:', responseText);

            if (!response.ok) {
                let errorMessage = 'Error al guardar ejercicio';
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                } catch {
                    errorMessage = responseText || 'Error desconocido';
                }
                throw new Error(errorMessage);
            }

            const data = JSON.parse(responseText);
            console.log('✅ Respuesta éxito:', data);

            showNotification(editingExercise ? 'Ejercicio actualizado' : 'Ejercicio creado', 'success');
            setShowModal(false);
            fetchData();
        } catch (error: any) {
            console.error('❌ Error detallado:', error);
            showNotification(error.message || 'Error al guardar ejercicio', 'error');
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
                    <p className="text-white font-semibold">Cargando ejercicios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            <div className="flex items-center justify-between mb-6 w-full max-w-6xl mx-auto px-1">
                <button onClick={() => router.back()} className="text-white hover:text-purple-200 transition">
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-black text-white">Gestionar ejercicios</h1>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black bg-white text-purple-600 border-2 border-black transition-all hover:-translate-y-0.5"
                    style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                >
                    <Plus size={16} /> Nuevo ejercicio
                </button>
            </div>

            <div
                className="w-full max-w-6xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-6">
                    <p className="text-gray-500 mb-4">{exercises.length} ejercicios en total</p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b-2 border-black">
                                <tr>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">ID</th>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">Nombre</th>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">Tipo</th>
                                    <th className="text-center py-3 px-2 text-gray-700 font-bold">Duración</th>
                                    <th className="text-center py-3 px-2 text-gray-700 font-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercises.map((exercise) => (
                                    <tr key={exercise.id} className="border-b border-gray-200">
                                        <td className="py-3 px-2 font-mono text-gray-900">{exercise.id}</td>
                                        <td className="py-3 px-2 font-semibold text-gray-900">{exercise.name}</td>
                                        <td className="py-3 px-2">
                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                                                {exercise.exerciseType?.type || 'Sin tipo'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-center text-gray-900">{exercise.duration} min</td>
                                        <td className="py-3 px-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(exercise)}
                                                    className="p-1 text-blue-500 hover:text-blue-700 transition"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(exercise)}
                                                    className="p-1 text-red-500 hover:text-red-700 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para crear/editar ejercicio */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="w-full max-w-md mx-4 rounded-[28px] overflow-hidden max-h-[90vh] overflow-y-auto"
                        style={{
                            background: '#F5F1E8',
                            border: '2.5px solid #1A1A1A',
                            boxShadow: '6px 6px 0px #1A1A1A',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Dumbbell size={24} className="text-purple-600" />
                                    <h3 className="text-lg font-black text-gray-900">
                                        {editingExercise ? 'Editar ejercicio' : 'Nuevo ejercicio'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-purple-500 outline-none transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-purple-500 outline-none transition"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                                        <select
                                            value={formData.exerciseTypeId}
                                            onChange={(e) =>
                                                setFormData({ ...formData, exerciseTypeId: parseInt(e.target.value) })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-purple-500 outline-none transition"
                                        >
                                            {exerciseTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Duración (min)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) =>
                                                setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
                                            }
                                            className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-purple-500 outline-none transition"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Instrucciones (una por línea)
                                    </label>
                                    <textarea
                                        value={formData.instructions}
                                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-purple-500 outline-none transition"
                                        placeholder="Paso 1: ...&#10;Paso 2: ...&#10;Paso 3: ..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-2 rounded-xl font-black text-gray-700 bg-white border-2 border-black transition-all hover:-translate-y-0.5"
                                        style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2 rounded-xl font-black text-white bg-purple-600 border-2 border-black transition-all hover:bg-purple-700 hover:-translate-y-0.5"
                                        style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                                    >
                                        <Save size={16} className="inline mr-1" />
                                        {editingExercise ? 'Actualizar' : 'Crear'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
