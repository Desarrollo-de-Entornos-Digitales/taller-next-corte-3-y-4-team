'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { creativeAreaService, CreativeArea } from './services/creative-area.service';
import onboardingAction from './onboarding.action';

interface TokenPayload {
    sub?: string | number;
}

// Función para obtener el userId del token
function getUserIdFromToken(): number | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) return null;

    try {
        const payload = JSON.parse(atob(parts[1])) as TokenPayload;
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

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const data = await creativeAreaService.getCreativeAreas();
                setAreas(data);
            } catch (err) {
                console.error('Error fetching creative areas:', err);
                setError('Error al cargar las áreas creativas');
            }
        };
        void fetchAreas();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedArea) return;

        const userId = getUserIdFromToken();
        if (!userId) {
            setError('No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.');
            router.push('/login');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No hay token de autenticación');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onboardingAction(selectedArea, userId, token);
            router.push('/feed');
        } catch (err: unknown) {
            console.error('Error in onboarding:', err);
            // Si es 409 (conflicto, perfil ya existe), redirigir al feed igual
            const error = err as { response?: { status?: number } };
            if (error.response?.status === 409) {
                router.push('/feed');
            } else {
                setError('Error al completar el onboarding');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
            <div className="bg-white p-8 rounded-2xl w-96">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Completa tu perfil</h1>
                <p className="mb-4 text-gray-600">Selecciona tu área creativa</p>

                {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

                <form onSubmit={(e) => void handleSubmit(e)}>
                    <select
                        value={selectedArea || ''}
                        onChange={(e) => setSelectedArea(Number(e.target.value))}
                        className="w-full p-2 border rounded mb-4 text-gray-800"
                        required
                    >
                        <option value="">Selecciona un área</option>
                        {areas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.area}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        disabled={loading || !selectedArea}
                        className="w-full bg-purple-600 text-white py-2 rounded disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Completar onboarding'}
                    </button>
                </form>
            </div>
        </div>
    );
}
