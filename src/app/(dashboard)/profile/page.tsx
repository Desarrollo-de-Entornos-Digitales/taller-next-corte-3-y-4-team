'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/context/NotificationContext';

interface UserProfile {
    id: number;
    email: string;
    name: string;
    rolId: number;
    rol?: { id: number; name: string };
    profile?: {
        creativeArea?: { id: number; area: string };
        bio?: string;
        location?: string;
    };
}

export default function ProfilePage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalExercises: 0,
        streak: 0,
        achievements: 0,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Obtener datos del usuario
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = await userRes.json();

                // Obtener perfil del usuario
                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userData.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let profileData = {};
                if (profileRes.ok) {
                    profileData = await profileRes.json();
                }

                setProfile({ ...userData, profile: profileData });

                // Obtener estadísticas
                const historyRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/exercise-history/user/${userData.id}`,
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                const history = await historyRes.json();
                setStats((prev) => ({ ...prev, totalExercises: history.length || 0 }));

                const streakRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-history/me/streak`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (streakRes.ok) {
                    const streakData = await streakRes.json();
                    setStats((prev) => ({ ...prev, streak: streakData.streak || 0 }));
                }

                const achievementsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user-achievements/user/${userData.id}`,
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                const achievements = await achievementsRes.json();
                setStats((prev) => ({ ...prev, achievements: achievements.length || 0 }));
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar el perfil', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router, showNotification]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        showNotification('Sesión cerrada correctamente', 'success');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <p className="text-gray-500">No se pudo cargar el perfil</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EDE8DC] py-10 px-5">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                    <button
                        onClick={() => router.push('/profile/edit')}
                        className="px-4 py-2 rounded-full text-purple-700 border border-purple-700 hover:bg-purple-50 transition"
                    >
                        Editar perfil
                    </button>
                </div>

                {/* Avatar y nombre */}
                <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg border-2 border-black text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-4">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                    <p className="text-sm text-purple-600 mt-1">
                        {profile.rol?.name === 'admin' ? 'Administrador' : 'Usuario'}
                    </p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-4 text-center shadow-md border border-gray-200">
                        <div className="text-2xl font-bold text-purple-600">{stats.totalExercises}</div>
                        <div className="text-xs text-gray-500">Ejercicios</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center shadow-md border border-gray-200">
                        <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
                        <div className="text-xs text-gray-500">Días de racha</div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 text-center shadow-md border border-gray-200">
                        <div className="text-2xl font-bold text-purple-600">{stats.achievements}</div>
                        <div className="text-xs text-gray-500">Logros</div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-black">
                    <h3 className="font-bold text-gray-900 mb-4">Información adicional</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Área creativa</p>
                            <p className="text-gray-900">{profile.profile?.creativeArea?.area || 'No especificada'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Biografía</p>
                            <p className="text-gray-900">{profile.profile?.bio || 'Sin biografía'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ubicación</p>
                            <p className="text-gray-900">{profile.profile?.location || 'No especificada'}</p>
                        </div>
                    </div>
                </div>

                {/* Botón cerrar sesión */}
                <button
                    onClick={handleLogout}
                    className="w-full mt-6 py-3 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 transition shadow-md"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}
