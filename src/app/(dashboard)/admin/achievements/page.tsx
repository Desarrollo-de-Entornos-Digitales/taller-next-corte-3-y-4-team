'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface Achievement {
    id: number;
    name: string;
    description: string;
    requirement: string;
    points: number;
    icon?: string;
}

export default function AdminAchievementsPage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        requirement: '',
        points: 0,
    });

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/achievements`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let data = await response.json();
            if (data && !Array.isArray(data)) {
                data = data.data || [];
            }
            setAchievements(data);
        } catch (error) {
            console.error(error);
            showNotification('Error al cargar logros', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingAchievement(null);
        setFormData({ name: '', description: '', requirement: '', points: 0 });
        setShowModal(true);
    };

    const handleEdit = (achievement: Achievement) => {
        setEditingAchievement(achievement);
        setFormData({
            name: achievement.name,
            description: achievement.description,
            requirement: achievement.requirement,
            points: achievement.points,
        });
        setShowModal(true);
    };

    const handleDelete = async (achievement: Achievement) => {
        if (!confirm(`¿Eliminar el logro "${achievement.name}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/achievements/${achievement.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                showNotification(`Logro "${achievement.name}" eliminado`, 'success');
                fetchAchievements();
            } else {
                throw new Error();
            }
        } catch {
            showNotification('Error al eliminar logro', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.requirement) {
            showNotification('Completa todos los campos', 'error');
            return;
        }

        console.log('📤 Enviando logro:', formData); // 👈 Agrega esto

        try {
            const token = localStorage.getItem('token');
            const url = editingAchievement
                ? `${process.env.NEXT_PUBLIC_API_URL}/achievements/${editingAchievement.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/achievements`;

            const method = editingAchievement ? 'PUT' : 'POST';

            console.log('📍 URL:', url);
            console.log('🔧 Método:', method);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            console.log('📡 Respuesta status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Respuesta:', data);
                showNotification(editingAchievement ? 'Logro actualizado' : 'Logro creado', 'success');
                setShowModal(false);
                fetchAchievements();
            } else {
                const errorData = await response.json();
                console.error('❌ Error:', errorData);
                showNotification(errorData.message || 'Error al guardar logro', 'error');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            showNotification('Error al guardar logro', 'error');
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
                    <p className="text-white font-semibold">Cargando logros...</p>
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
                <h1 className="text-lg font-black text-white">Gestionar logros</h1>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black bg-white text-purple-600 border-2 border-black transition-all hover:-translate-y-0.5"
                    style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                >
                    <Plus size={16} /> Nuevo logro
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
                    <p className="text-gray-500 mb-4">{achievements.length} logros en total</p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b-2 border-black">
                                <tr>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">ID</th>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">Nombre</th>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">Descripción</th>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">Requisito</th>
                                    <th className="text-center py-3 px-2 text-gray-700 font-bold">Puntos</th>
                                    <th className="text-center py-3 px-2 text-gray-700 font-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {achievements.map((achievement) => (
                                    <tr key={achievement.id} className="border-b border-gray-200">
                                        <td className="py-3 px-2 font-mono text-gray-900">{achievement.id}</td>
                                        <td className="py-3 px-2 font-semibold text-gray-900">{achievement.name}</td>
                                        <td className="py-3 px-2 text-gray-600 max-w-xs truncate">
                                            {achievement.description}
                                        </td>
                                        <td className="py-3 px-2 text-gray-600">{achievement.requirement}</td>
                                        <td className="py-3 px-2 text-center text-gray-900">{achievement.points}</td>
                                        <td className="py-3 px-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(achievement)}
                                                    className="p-1 text-blue-500 hover:text-blue-700 transition"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(achievement)}
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

            {/* Modal para crear/editar logro */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="w-full max-w-md mx-4 rounded-[28px] overflow-hidden"
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
                                    <Trophy size={24} className="text-purple-600" />
                                    <h3 className="text-lg font-black text-gray-900">
                                        {editingAchievement ? 'Editar logro' : 'Nuevo logro'}
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
                                        rows={2}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-purple-500 outline-none transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Requisito</label>
                                    <input
                                        type="text"
                                        value={formData.requirement}
                                        onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-purple-500 outline-none transition"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Puntos</label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={(e) =>
                                            setFormData({ ...formData, points: parseInt(e.target.value) || 0 })
                                        }
                                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-purple-500 outline-none transition"
                                        min="0"
                                        required
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
                                        {editingAchievement ? 'Actualizar' : 'Crear'}
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
