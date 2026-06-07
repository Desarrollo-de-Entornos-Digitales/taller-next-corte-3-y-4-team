'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, BookOpen, User } from 'lucide-react';

interface UserModalProps {
    userId: number;
    userName: string;
    isOpen: boolean;
    onClose: () => void;
}

interface UserProfileData {
    id: number;
    email: string;
    name: string;
    rolId: number;
    profile?: {
        id: number;
        bio: string;
        location: string;
        creativeAreaId: number;
        creativeArea?: {
            id: number;
            area: string;
        };
    };
}

export default function UserModal({ userId, userName, isOpen, onClose }: UserModalProps) {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfileData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !userId) return;

        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No hay sesión iniciada');
                    return;
                }

                // Obtener datos básicos del usuario
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!userRes.ok) {
                    throw new Error('Error al cargar datos del usuario');
                }

                const userDataRaw = await userRes.json();

                // Obtener perfil del usuario
                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                let profileData = null;
                if (profileRes.ok) {
                    profileData = await profileRes.json();
                }

                setUserData({
                    ...userDataRaw,
                    profile: profileData,
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('No se pudo cargar la información del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, isOpen]);

    if (!isOpen) return null;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div
                className="w-full max-w-md mx-4 rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b-2 border-black/10">
                    <h3 className="text-lg font-black text-gray-900">Perfil de usuario</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-1"
                        aria-label="Cerrar"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-5">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-sm text-gray-500">Cargando información...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-6">
                            <p className="text-red-500 text-sm mb-3">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-sm text-purple-600 font-semibold underline"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : userData ? (
                        <div>
                            {/* Avatar y nombre */}
                            <div className="flex items-center gap-4 mb-5">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                                    style={{
                                        background: '#8B5BDB',
                                        border: '2px solid #1A1A1A',
                                        boxShadow: '2px 2px 0px #1A1A1A',
                                    }}
                                >
                                    {getInitials(userData.name)}
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-lg">{userData.name}</h4>
                                    <p className="text-sm text-gray-500">{userData.email}</p>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="space-y-3">
                                {/* Área creativa */}
                                <div className="flex items-center gap-3 text-sm">
                                    <BookOpen size={16} className="text-purple-600 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        <span className="font-semibold">Área creativa:</span>{' '}
                                        {userData.profile?.creativeArea?.area || 'No especificada'}
                                    </span>
                                </div>

                                {/* Ubicación */}
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin size={16} className="text-purple-600 flex-shrink-0" />
                                    <span className="text-gray-700">
                                        <span className="font-semibold">Ubicación:</span>{' '}
                                        {userData.profile?.location || 'No especificada'}
                                    </span>
                                </div>

                                {/* Biografía */}
                                <div className="mt-4 p-4 rounded-xl" style={{ background: '#EDE8DC' }}>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Sobre mí
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {userData.profile?.bio || 'Este usuario aún no ha escrito una biografía.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-500 text-sm">No se encontró información del usuario</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
