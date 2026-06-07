'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface CreativeArea {
    id: number;
    area: string;
}

export default function EditProfilePage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [creativeAreas, setCreativeAreas] = useState<CreativeArea[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        creativeAreaId: '',
        bio: '',
        location: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Estados para mostrar/ocultar contraseñas
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const userId = JSON.parse(atob(token.split('.')[1])).sub;

                // Cargar áreas creativas
                const areasRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creative-areas`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let areasData = await areasRes.json();
                if (areasData && !Array.isArray(areasData)) {
                    areasData = areasData.data || [];
                }
                setCreativeAreas(areasData);

                // Cargar datos del usuario
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = await userRes.json();

                // Cargar perfil del usuario
                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let profileData = {};
                if (profileRes.ok) {
                    profileData = await profileRes.json();
                }

                setFormData((prev) => ({
                    ...prev,
                    name: userData.name || '',
                    creativeAreaId: (profileData as any).creativeAreaId?.toString() || '',
                    bio: (profileData as any).bio || '',
                    location: (profileData as any).location || '',
                }));
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar los datos', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, showNotification]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const userId = JSON.parse(atob(token.split('.')[1])).sub;

            // 1. Actualizar nombre en users
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: formData.name }),
            });

            if (!userResponse.ok) {
                throw new Error('Error al actualizar el nombre');
            }

            // 2. Obtener el perfil actual
            const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (profileRes.ok) {
                const profile = await profileRes.json();

                // 3. Actualizar el perfil
                const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${profile.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        creativeAreaId: formData.creativeAreaId ? parseInt(formData.creativeAreaId) : null,
                        bio: formData.bio,
                        location: formData.location,
                    }),
                });

                if (!updateRes.ok) {
                    throw new Error('Error al actualizar el perfil');
                }
            }

            // 4. Cambiar contraseña si se completaron los campos
            if (formData.oldPassword && formData.newPassword && formData.confirmPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    showNotification('Las contraseñas nuevas no coinciden', 'error');
                    setSaving(false);
                    return;
                }
                if (formData.newPassword.length < 6) {
                    showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
                    setSaving(false);
                    return;
                }

                const passwordResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        oldPassword: formData.oldPassword,
                        newPassword: formData.newPassword,
                    }),
                });

                if (!passwordResponse.ok) {
                    const error = await passwordResponse.json();
                    showNotification(error.message || 'Error al cambiar la contraseña', 'error');
                    setSaving(false);
                    return;
                }
            }

            showNotification('Perfil actualizado correctamente', 'success');
            router.push('/profile');
        } catch (error) {
            console.error(error);
            showNotification('Error al actualizar el perfil', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
                <div className="flex items-center justify-center min-h-[calc(100vh-2rem)]">
                    <div className="text-center">
                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white font-semibold">Cargando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            <div className="flex items-center justify-between mb-6 w-full max-w-2xl mx-auto px-1">
                <button
                    onClick={() => router.back()}
                    className="text-white hover:text-purple-200 transition"
                    aria-label="Volver"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-black text-white">Editar perfil</h1>
                <div className="w-6" />
            </div>

            {/* Card flotante */}
            <div
                className="w-full max-w-2xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                            required
                        />
                    </div>

                    {/* Área creativa */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Área creativa</label>
                        <select
                            value={formData.creativeAreaId}
                            onChange={(e) => setFormData({ ...formData, creativeAreaId: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                        >
                            <option value="">Selecciona un área</option>
                            {creativeAreas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.area}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Biografía */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Biografía</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                            placeholder="Cuéntanos sobre ti..."
                        />
                    </div>

                    {/* Ubicación */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Ubicación</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                            placeholder="Ciudad, País"
                        />
                    </div>

                    {/* Separador */}
                    <div className="border-t-2 border-dashed border-gray-200 my-4" />

                    {/* Cambiar contraseña */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña actual</label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                value={formData.oldPassword}
                                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 pr-12 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                            >
                                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nueva contraseña</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 pr-12 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                placeholder="•••••••• (mínimo 6 caracteres)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirmar nueva contraseña</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 pr-12 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Botones principales */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-3 rounded-xl font-black text-gray-700 bg-white border-2 border-black transition-all hover:-translate-y-0.5 active:translate-y-0"
                            style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 rounded-xl font-black text-white bg-purple-600 border-2 border-black transition-all hover:bg-purple-700 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
                            style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                        >
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
