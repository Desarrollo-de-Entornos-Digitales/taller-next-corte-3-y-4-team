'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import { registerService } from './services/register.service';
import registerAction from './register.action';

export default function Register() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(formRef.current!);
        const name = String(formData.get('name'));
        const email = String(formData.get('email'));
        const password = String(formData.get('password'));

        if (!name || !email || !password) {
            console.error('Todos los campos son obligatorios');
            return;
        }

        const result = await registerAction(name, email, password);
        localStorage.setItem('token', result.access_token);
        router.push('/feed');
    };

    return (
        <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Crear cuenta</h2>
                <form ref={formRef} onSubmit={handleSubmit}>
                    <input
                        name="name"
                        type="text"
                        placeholder="Nombre completo"
                        className="w-full p-3 rounded-xl bg-gray-100 outline-none mb-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 transition-all"
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full p-3 rounded-xl bg-gray-100 outline-none mb-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 transition-all"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-3 rounded-xl bg-gray-100 outline-none mb-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 transition-all"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full mt-6 py-3 rounded-2xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                    >
                        Registrarse
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <span
                            className="text-pink-500 cursor-pointer hover:text-pink-600 transition-colors font-medium"
                            onClick={() => router.push('/login')}
                        >
                            Inicia sesión
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
