'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import registerAction from './register.action';

export default function RegisterPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(formRef.current!);
        const name = String(formData.get('name'));
        const email = String(formData.get('email'));
        const password = String(formData.get('password'));
        const result = await registerAction(name, email, password);
        localStorage.setItem('token', result.access_token);
        router.push('/onboarding');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Crear cuenta</h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    {/* Nombre completo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Tu nombre"
                            required
                            className="w-full px-4 py-3 rounded-full bg-gray-100 border-0 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="usuario@ludix.com"
                            required
                            className="w-full px-4 py-3 rounded-full bg-gray-100 border-0 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-full bg-gray-100 border-0 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Botón registrarse */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-full font-semibold text-white bg-purple-500 hover:bg-purple-600 active:scale-95 transition-all duration-200 shadow-md text-sm mt-2"
                    >
                        Registrarse
                    </button>

                    {/* Separador */}
                    <div className="flex items-center gap-3 text-gray-300 text-xs">
                        <div className="flex-1 h-px bg-gray-200" />
                        o
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Login */}
                    <p className="text-center text-sm text-gray-500">
                        ¿Ya tienes cuenta?{' '}
                        <span
                            className="text-purple-500 font-semibold cursor-pointer hover:underline"
                            onClick={() => router.push('/login')}
                        >
                            Inicia sesión
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
