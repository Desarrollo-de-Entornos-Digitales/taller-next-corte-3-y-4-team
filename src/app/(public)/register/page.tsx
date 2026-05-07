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
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#EDE8DC' }}>
            <div className="w-full max-w-sm bg-white rounded-3xl px-8 pt-10 pb-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Crear cuenta</h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
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
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-full font-semibold text-white bg-purple-500 hover:bg-purple-600 active:scale-95 transition-all duration-200 shadow-md text-sm"
                    >
                        Registrarse
                    </button>

                    <div className="flex items-center gap-3 text-gray-300 text-xs">
                        <div className="flex-1 h-px bg-gray-200" /> o <div className="flex-1 h-px bg-gray-200" />
                    </div>

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
