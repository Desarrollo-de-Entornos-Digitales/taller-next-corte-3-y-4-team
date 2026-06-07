'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Star,
    History,
    LogOut,
    ChevronRight,
    Pencil,
    Shield,
    Users,
    Trophy,
    Dumbbell,
    Key,
    Ban,
} from 'lucide-react';
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
    const [isAdmin, setIsAdmin] = useState(false);
    const [stats, setStats] = useState({
        totalExercises: 0,
        streak: 0,
        achievements: 0,
        favorites: 0,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.sub;

                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = await userRes.json();

                // Verificar si es admin
                setIsAdmin(userData.rolId === 1 || userData.rol?.name === 'admin');

                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let profileData = {};
                if (profileRes.ok) profileData = await profileRes.json();
                setProfile({ ...userData, profile: profileData });

                const historyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-history/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let historyData = await historyRes.json();
                if (historyData && !Array.isArray(historyData)) historyData = historyData.data || [];
                setStats((prev) => ({ ...prev, totalExercises: historyData.length || 0 }));

                const streakRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-history/me/streak`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (streakRes.ok) {
                    const streakData = await streakRes.json();
                    setStats((prev) => ({ ...prev, streak: streakData.streak || 0 }));
                }

                const achievementsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user-achievements/user/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                let achievementsData = await achievementsRes.json();
                if (achievementsData && !Array.isArray(achievementsData))
                    achievementsData = achievementsData.data || [];
                setStats((prev) => ({ ...prev, achievements: achievementsData.length || 0 }));

                const favRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let favData = await favRes.json();
                if (favData && !Array.isArray(favData)) favData = favData.data || [];
                setStats((prev) => ({ ...prev, favorites: favData.length || 0 }));
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
            <div
                className="min-h-screen font-[Nunito,sans-serif] flex items-center justify-center"
                style={{ background: '#8B5BDB' }}
            >
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-semibold">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div
                className="min-h-screen font-[Nunito,sans-serif] flex items-center justify-center"
                style={{ background: '#8B5BDB' }}
            >
                <p className="text-white">No se pudo cargar el perfil</p>
            </div>
        );
    }

    const menuItems = [
        { icon: Star, label: 'Mis favoritos', path: '/favorites' },
        { icon: History, label: 'Mi historial', path: '/history' },
    ];

    const adminItems = [
        { icon: Ban, label: 'Bloquear usuarios', path: '/admin/blocked-users' },
        { icon: Trophy, label: 'Gestionar logros', path: '/admin/achievements' },
        { icon: Dumbbell, label: 'Gestionar ejercicios', path: '/admin/exercises' },
        { icon: Key, label: 'Permisos', path: '/admin/permissions' },
    ];

    const statItems = [
        { value: stats.totalExercises, label: 'Ejercicios', emoji: '🏋️' },
        { value: stats.streak, label: 'Días de racha', emoji: '🔥' },
        { value: stats.achievements, label: 'Logros', emoji: '🏆' },
        { value: stats.favorites, label: 'Favoritos', emoji: '⭐' },
    ];

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            {/* Header fuera de la card */}
            <div className="flex items-center justify-between mb-6 w-full max-w-4xl mx-auto px-1">
                <button
                    onClick={() => router.back()}
                    className="text-white hover:text-purple-200 transition"
                    aria-label="Volver"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-black text-white">Mi perfil</h1>
                <button
                    onClick={() => router.push('/profile/edit')}
                    className="flex items-center gap-1 text-sm font-bold text-purple-200 hover:text-white transition"
                >
                    <Pencil size={13} />
                    Editar
                </button>
            </div>

            {/* Card única flotante */}
            <div
                className="w-full max-w-4xl mx-auto rounded-[28px] overflow-hidden relative"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                {/* Banner degradado superior */}
                <div
                    className="absolute top-0 left-0 right-0 h-28 rounded-t-[28px] pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, #C2D8F0 0%, #C8C2EA 55%, #C4B8E8 100%)',
                        opacity: 0.35,
                    }}
                />

                {/* Información en fila: avatar + nombre/área | bio + ubicación */}
                <div className="relative z-10 flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full border-4 border-white bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black text-white shadow-md"
                            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                        >
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900">{profile.name}</h2>
                            <p className="text-sm text-gray-400 font-semibold">
                                {profile.profile?.creativeArea?.area || 'Área no especificada'}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        {profile.profile?.bio && (
                            <p className="text-sm text-gray-600 italic">"{profile.profile.bio}"</p>
                        )}
                        {profile.profile?.location && (
                            <p className="text-xs text-gray-400 flex items-center justify-end gap-1 mt-1">
                                <span>📍</span> {profile.profile.location}
                            </p>
                        )}
                        {!profile.profile?.bio && !profile.profile?.location && (
                            <p className="text-xs text-gray-400 italic">Sin información adicional</p>
                        )}
                    </div>
                </div>

                {/* Stats 2x2 */}
                <div className="grid grid-cols-2 relative z-10">
                    {statItems.map((stat, idx) => (
                        <div
                            key={stat.label}
                            className={`p-4 text-center ${
                                idx % 2 === 0 ? 'border-r border-gray-100' : ''
                            } ${idx < 2 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="text-xl font-black text-purple-600">{stat.value}</div>
                            <div className="text-xs font-bold text-gray-400 mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Menú principal */}
                {menuItems.map((item, idx) => (
                    <button
                        key={item.label}
                        onClick={() => router.push(item.path)}
                        className={`w-full flex items-center justify-between px-5 py-4 hover:bg-[#e8e4da] transition relative z-10 ${
                            idx !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={17} className="text-purple-400" />
                            <span className="text-sm font-bold text-gray-700">{item.label}</span>
                        </div>
                        <ChevronRight size={15} className="text-gray-300" />
                    </button>
                ))}

                {/* Sección de administración (solo visible para admin) */}
                {isAdmin && (
                    <>
                        <div className="px-5 pt-2 pb-1 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Administración</p>
                        </div>
                        {adminItems.map((item, idx) => (
                            <button
                                key={item.label}
                                onClick={() => router.push(item.path)}
                                className={`w-full flex items-center justify-between px-5 py-4 hover:bg-[#e8e4da] transition relative z-10 ${
                                    idx !== adminItems.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={17} className="text-purple-400" />
                                    <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                </div>
                                <ChevronRight size={15} className="text-gray-300" />
                            </button>
                        ))}
                    </>
                )}

                {/* Cerrar sesión */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50 transition group relative z-10 border-t border-gray-100"
                >
                    <div className="flex items-center gap-3">
                        <LogOut size={17} className="text-red-400" />
                        <span className="text-sm font-bold text-red-400">Cerrar sesión</span>
                    </div>
                    <ChevronRight size={15} className="text-red-300" />
                </button>
            </div>
        </div>
    );
}
