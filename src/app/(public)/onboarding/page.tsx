'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Grid from '@/components/ui/Grid';
import OptionCard from '@/components/ui/OptionCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

import { creativeAreaService, CreativeArea } from './services/creative-area.service';
import onboardingAction from './onboarding.action';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);
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
                    // Ya tiene perfil, redirigir al feed
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
        if (!selectedArea) return;

        const userId = getUserIdFromToken();
        if (!userId) {
            router.push('/login');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(true);

        try {
            await onboardingAction(selectedArea, userId, token);
        } catch (err) {
            console.error('Error al guardar el área, pero continuamos:', err);
        } finally {
            router.push('/feed');
        }
    };

    // Pantalla de carga mientras verificamos si tiene perfil
    if (checkingProfile) {
        return (
            <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Pantalla de confirmación
    if (done) {
        return (
            <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                    <div className="text-6xl mb-4">🎉✨</div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">¡Todo listo!</h1>
                    <p className="text-gray-500 mb-8">
                        Ya puedes empezar a desbloquearte con ejercicios diseñados para creativos como tú.
                    </p>
                    <Button variant="primary" onClick={() => router.push('/feed')}>
                        Ir al Home
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">Personalizaremos tus recomendaciones según tu área</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-2xl mx-auto">
                {/* Logo y paso */}
                <div className="text-center mb-6">
                    <div className="text-5xl mb-2">🎨✨</div>
                    <p className="text-sm text-gray-400">Paso 1 de 1</p>
                </div>

                {/* Títulos */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Cuéntanos sobre ti</h1>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        Personalizaremos tu experiencia en LUDIX con ejercicios adaptados a tu perfil.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <p className="font-bold text-gray-800 mb-4">Área creativa</p>

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

                    <div className="mt-8">
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={loading || !selectedArea}
                            className="w-full"
                        >
                            {loading ? 'Guardando...' : selectedArea ? 'Siguiente' : 'Selecciona una opción'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
