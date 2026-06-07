'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="relative min-h-screen w-full overflow-hidden" style={{ background: '#000000' }}>
            {/* Imagen izquierda - 6 veces más grande */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <img
                    src="/portada-izquierda.png"
                    alt="Ilustración izquierda"
                    className="w-[1200px] md:w-[800px] lg:w-[1280px] h-auto object-contain"
                />
            </div>

            {/* Imagen derecha - 6 veces más grande */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <img
                    src="/portada-derecha.png"
                    alt="Ilustración derecha"
                    className="w-[1200px] md:w-[800px] lg:w-[1280px] h-auto object-contain"
                />
            </div>

            {/* Contenido central */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-10 px-8">
                {/* Logo */}
                <img src="/logo-ludix.png" alt="Lúdix" className="w-64 md:w-80" />

                {/* Botones */}
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full py-4 rounded-full bg-purple-600 text-white font-bold text-lg tracking-wide shadow-xl hover:bg-purple-700 hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                    >
                        Iniciar sesión
                    </button>
                    <button
                        onClick={() => router.push('/register')}
                        className="w-full py-4 rounded-full bg-white text-purple-600 font-bold text-lg tracking-wide shadow-xl border-2 border-purple-600 hover:bg-gray-100 hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
}
