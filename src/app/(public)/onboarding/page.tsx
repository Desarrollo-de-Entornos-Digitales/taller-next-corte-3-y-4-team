'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { creativeAreaService, CreativeArea } from './services/creative-area.service';
import onboardingAction from './onboarding.action';

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
        fetchAreas();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedArea) return;

        setLoading(true);
        setError(null);

        try {
            // Asumiendo userId = 1 por ahora, en producción obtener del token
            const userId = 1;
            await onboardingAction(selectedArea, userId);
            router.push('/dashboard'); // o donde corresponda después del onboarding
        } catch (err) {
            console.error('Error in onboarding:', err);
            setError('Error al completar el onboarding');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
            <div className="bg-white p-8 rounded-2xl w-96">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Completa tu perfil</h1>
                <p className="mb-4 text-gray-600">Selecciona tu área creativa</p>

                {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

                <form onSubmit={handleSubmit}>
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
