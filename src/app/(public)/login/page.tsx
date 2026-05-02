'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

import loginAction from './login.action';

export default function Login() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(formRef.current!);
        const email = String(formData.get('email'));
        const password = String(formData.get('password'));

        const result = await loginAction(email, password);
        localStorage.setItem('token', result.access_token);
        router.push('/feed');
    };

    return (
        <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-md p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Bienvenido de vuelta!</h2>
                <form ref={formRef} onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full p-3 rounded-xl bg-gray-100 outline-none mb-3"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-3 rounded-xl bg-gray-100 outline-none mb-2"
                        required
                    />
                    <p className="text-sm text-gray-400 mt-2 cursor-pointer">Olvidaste tu contraseña?</p>
                    <button
                        type="submit"
                        className="w-full mt-6 py-3 rounded-2xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                        Iniciar sesión
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-gray-500">
                        No tienes cuenta? <span className="text-pink-500 cursor-pointer">Regístrate</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
