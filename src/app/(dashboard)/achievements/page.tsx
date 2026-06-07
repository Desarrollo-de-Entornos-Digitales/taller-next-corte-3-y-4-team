'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface Achievement {
    id: number;
    name: string;
    description: string;
    requirement: string;
    icon?: string;
    current?: number;
    total?: number;
}

interface UserAchievement {
    achievementId: number;
    dateOfAchievement: string;
}

// Mapa de íconos por nombre de logro
const ACHIEVEMENT_ICONS: Record<string, string> = {
    default_unlocked: '💬',
    default_locked: '🔒',
    'Primer comentario': '💬',
    'Racha de 7 días': '🔥',
    Explorador: '🗺️',
    'Primer ejercicio': '🌟',
    'Maestro creativo': '🏆',
    Conversador: '🗣️',
    Crítico: '✍️',
    Experto: '🎓',
};

function AchievementIcon({ name, achieved }: { name: string; achieved: boolean }) {
    const icon = ACHIEVEMENT_ICONS[name] ?? (achieved ? '⭐' : '🔒');
    return (
        <div
            style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: achieved ? '#ffffff' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                margin: '0 auto 12px',
                boxShadow: achieved ? '0 0 0 3px #22c55e' : 'none',
                border: '2px solid #1A1A1A',
            }}
        >
            {achieved ? (icon === '🔒' ? '⭐' : icon) : '🔒'}
        </div>
    );
}

export default function AchievementsPage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const userId = JSON.parse(atob(token.split('.')[1])).sub;

                const achievementsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/achievements`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let allAchievements = await achievementsRes.json();
                if (allAchievements && !Array.isArray(allAchievements)) {
                    allAchievements = allAchievements.data || [];
                }
                setAchievements(allAchievements);

                const userAchievementsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user-achievements/user/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                let userAchievementsData = await userAchievementsRes.json();
                if (userAchievementsData && !Array.isArray(userAchievementsData)) {
                    userAchievementsData = userAchievementsData.data || [];
                }
                setUserAchievements(userAchievementsData);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar los logros', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [router, showNotification]);

    const isAchieved = (achievementId: number) => userAchievements.some((ua) => ua.achievementId === achievementId);

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

    const achievedCount = achievements.filter((a) => isAchieved(a.id)).length;
    const totalCount = achievements.length;
    const progress = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            {/* Header con flecha de retroceso */}
            <div className="flex items-center justify-between mb-6 w-full max-w-4xl mx-auto px-1">
                <button
                    onClick={() => router.back()}
                    className="text-white hover:text-purple-200 transition"
                    aria-label="Volver"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-black text-white">Mis logros</h1>
                <div className="w-6" /> {/* Espaciador para centrar el título */}
            </div>

            {/* Panel principal — card flotante como en el feed */}
            <div
                className="w-full max-w-4xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-6 sm:p-8">
                    {/* Progress card con estilo consistente */}
                    <div
                        className="mb-6"
                        style={{
                            background: '#fff',
                            borderRadius: 20,
                            padding: '16px 20px',
                            border: '2px solid #1A1A1A',
                            boxShadow: '4px 4px 0px #1A1A1A',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 10,
                            }}
                        >
                            <span style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}>Progreso general</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div
                            style={{
                                height: 10,
                                background: '#e5e7eb',
                                borderRadius: 999,
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: `${progress}%`,
                                    background: '#111827',
                                    borderRadius: 999,
                                    transition: 'width 0.6s ease',
                                }}
                            />
                        </div>
                    </div>

                    {/* Achievement grid */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: 16,
                        }}
                    >
                        {achievements.map((achievement) => {
                            const achieved = isAchieved(achievement.id);
                            const hasMiniProgress =
                                typeof achievement.current === 'number' && typeof achievement.total === 'number';

                            return (
                                <div
                                    key={achievement.id}
                                    className="bg-white"
                                    style={{
                                        borderRadius: 20,
                                        padding: '20px 14px 16px',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 6,
                                        opacity: achieved ? 1 : 0.85,
                                        transition: 'transform 0.15s',
                                        border: '2px solid #1A1A1A',
                                        boxShadow: '4px 4px 0px #1A1A1A',
                                    }}
                                >
                                    {/* Icon */}
                                    <AchievementIcon name={achievement.name} achieved={achieved} />

                                    {/* Name */}
                                    <p
                                        style={{
                                            fontWeight: 700,
                                            fontSize: 14,
                                            color: '#111827',
                                            margin: 0,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {achievement.name}
                                    </p>

                                    {/* Description */}
                                    <p
                                        style={{
                                            fontSize: 12,
                                            color: '#6b7280',
                                            margin: 0,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {achievement.description}
                                    </p>

                                    {/* Mini progress */}
                                    {hasMiniProgress && !achieved && (
                                        <div style={{ width: '100%', marginTop: 4 }}>
                                            <p
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: '#6366f1',
                                                    margin: '0 0 6px',
                                                }}
                                            >
                                                {achievement.current}/{achievement.total}
                                            </p>
                                            <div
                                                style={{
                                                    height: 6,
                                                    background: '#e5e7eb',
                                                    borderRadius: 999,
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        height: '100%',
                                                        width: `${(achievement.current! / achievement.total!) * 100}%`,
                                                        background: '#111827',
                                                        borderRadius: 999,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Status badge */}
                                    {achieved ? (
                                        <div
                                            style={{
                                                marginTop: 8,
                                                background: '#22c55e',
                                                color: 'white',
                                                fontSize: 12,
                                                fontWeight: 700,
                                                borderRadius: 999,
                                                padding: '6px 16px',
                                                border: '2px solid #1A1A1A',
                                                boxShadow: '2px 2px 0px #1A1A1A',
                                            }}
                                        >
                                            ✓ Recibido
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                marginTop: 8,
                                                background: '#f3f4f6',
                                                color: '#9ca3af',
                                                fontSize: 12,
                                                fontWeight: 700,
                                                borderRadius: 999,
                                                padding: '6px 16px',
                                                border: '2px solid #e5e7eb',
                                            }}
                                        >
                                            🔒 Bloqueado
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
