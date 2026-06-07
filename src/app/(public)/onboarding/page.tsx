'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import Button from '@/components/ui/Button';
import Grid from '@/components/ui/Grid';
import OptionCard from '@/components/ui/OptionCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

import { creativeAreaService, CreativeArea } from './services/creative-area.service';

const AREA_EMOJIS: Record<string, string> = {
    'Diseño Gráfico': '🎨',
    'UI/UX': '📱',
    Ilustración: '✏️',
    Animación: '🎬',
    Publicidad: '📢',
    Otra: '🎭',
};

function getUserIdFromToken(): number | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) return null;

    try {
        const payload = JSON.parse(atob(parts[1])) as { sub?: string | number };
        const sub = payload.sub;
        if (typeof sub === 'number') return sub;
        if (typeof sub === 'string' && /^\d+$/.test(sub)) return Number(sub);
        return null;
    } catch {
        return null;
    }
}

export default function Onboarding() {
    const router = useRouter();
    const [areas, setAreas] = useState<CreativeArea[]>([]);
    const [selectedArea, setSelectedArea] = useState<number | null>(null);
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkingProfile, setCheckingProfile] = useState(true);

    // Verificar si el usuario ya tiene perfil
    useEffect(() => {
        const checkProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const userId = getUserIdFromToken();
            if (!userId) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    router.push('/feed');
                    return;
                }
            } catch {
                // Si hay error, continuar con onboarding
            } finally {
                setCheckingProfile(false);
            }
        };

        checkProfile();
    }, [router]);

    useEffect(() => {
        if (checkingProfile) return;

        const fetchAreas = async () => {
            try {
                const data = await creativeAreaService.getCreativeAreas();
                setAreas(data);
            } catch {
                setError('Error al cargar las áreas creativas');
            }
        };
        fetchAreas();
    }, [checkingProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedArea) {
            setError('Por favor selecciona un área creativa');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
            router.push('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    creativeAreaId: selectedArea,
                    bio: bio || null,
                    location: location || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el perfil');
            }

            router.push('/onboarding/success');
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || 'Error al guardar tu información');
        } finally {
            setLoading(false);
        }
    };

    if (checkingProfile) {
        return (
            <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
                <LoadingSpinner />
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
                <h1 className="text-lg font-black text-white">Completa tu perfil</h1>
                <div className="w-6" />
            </div>

            <div
                className="w-full max-w-2xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-2">🎨✨</div>
                        <p className="text-sm text-gray-400">Paso 1 de 1</p>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cuéntanos sobre ti</h1>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            Personalizaremos tu experiencia en LUDIX con ejercicios adaptados a tu perfil.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <p className="font-bold text-gray-800 mb-4">Área creativa *</p>

                        {error && <ErrorMessage message={error} />}

                        {areas.length === 0 ? (
                            <LoadingSpinner />
                        ) : (
                            <Grid cols={2} gap="md">
                                {areas.map((area) => (
                                    <OptionCard
                                        key={area.id}
                                        emoji={AREA_EMOJIS[area.area] ?? '🎨'}
                                        label={area.area}
                                        selected={selectedArea === area.id}
                                        onClick={() => setSelectedArea(area.id)}
                                    />
                                ))}
                            </Grid>
                        )}

                        <div className="mt-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Biografía <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                placeholder="Cuéntanos un poco sobre ti, tu experiencia, intereses..."
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Ubicación <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                placeholder="Ciudad, País"
                            />
                        </div>

                        <div className="mt-8">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading || !selectedArea}
                                className="w-full"
                            >
                                {loading ? 'Guardando...' : selectedArea ? 'Siguiente' : 'Selecciona una opción'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
