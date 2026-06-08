'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingSuccessPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserName(payload.name || payload.email?.split('@')[0] || 'Usuario');
        } catch (error) {
            console.error('Error al decodificar token:', error);
            setUserName('Usuario');
        }
    }, [router]);

    return (
        <div
            className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6 flex items-center justify-center"
            style={{ background: '#8B5BDB' }}
        >
            <div
                className="w-full max-w-md mx-auto rounded-[28px] overflow-hidden text-center"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-8">
                    {/* Mensaje de éxito */}
                    <h1 className="text-3xl font-black text-gray-900 mb-3">¡Todo listo, {userName}!</h1>

                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Tu perfil está completo. Ahora puedes empezar a desbloquear tu creatividad con ejercicios
                        diseñados especialmente para ti.
                    </p>

                    {/* Botón Ir al Home */}
                    <button
                        onClick={() => router.push('/feed')}
                        className="w-full py-4 rounded-full font-black text-white text-base transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                        style={{
                            background: '#8B5BDB',
                            border: '2.5px solid #1A1A1A',
                            boxShadow: '4px 4px 0px #1A1A1A',
                        }}
                    >
                        Ir al Home
                    </button>

                    {/* Texto adicional */}
                    <p className="text-xs text-gray-400 mt-6">Personalizaremos tus recomendaciones según tu perfil</p>
                </div>
            </div>
        </div>
    );
}
