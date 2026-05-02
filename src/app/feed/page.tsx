'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Feed() {
    const router = useRouter();
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Decodificar token para obtener el email (opcional)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setEmail(payload.email);
        } catch {
            setEmail('Usuario');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-md text-center">
                <h1 className="text-3xl font-bold mb-4">¡Bienvenido al Feed! 🎉</h1>
                <p className="text-gray-600 mb-4">
                    Has iniciado sesión correctamente como: <strong>{email}</strong>
                </p>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/login');
                    }}
                    className="mt-4 px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}
