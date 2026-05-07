interface LayoutAuthProps {
    children: React.ReactNode;
}

export default function LayoutAuth({ children }: LayoutAuthProps) {
    return (
        <div className="min-h-screen flex font-[Nunito,sans-serif]">
            {/* Panel izquierdo */}
            <div className="relative hidden lg:flex flex-col items-center justify-center flex-[1.1] overflow-hidden bg-gradient-to-br from-[#c9a8f5] via-[#b48ae8] to-[#9d6fe0] px-12 py-16">
                {/* Blobs decorativos */}
                <div className="absolute w-[200px] h-[200px] rounded-full bg-white/20 -top-16 -left-16" />
                <div className="absolute w-[140px] h-[140px] rounded-full bg-[#f0c0f8]/25 bottom-10 -right-10" />
                <div className="absolute w-[90px] h-[90px] rounded-full bg-[#fde68a]/30 bottom-28 left-5" />

                {/* Personaje nubecita */}
                <div className="relative animate-[float_3s_ease-in-out_infinite]">
                    <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
                    <div className="relative w-[110px] h-[90px] bg-[#8b5cf6] rounded-[50px_50px_12px_12px] shadow-[0_8px_24px_rgba(109,40,217,0.4)] flex items-center justify-center">
                        {/* Bolitas superiores de la nube */}
                        <div className="absolute w-[44px] h-[44px] bg-[#8b5cf6] rounded-full -top-5 left-4" />
                        <div className="absolute w-[30px] h-[30px] bg-[#8b5cf6] rounded-full -top-3 left-[52px]" />
                        {/* Ojos */}
                        <div className="flex gap-4 items-center relative z-10">
                            <div className="w-3 h-3 bg-[#2d1b69] rounded-full" />
                            <div className="w-3 h-3 bg-[#2d1b69] rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Logo */}
                <h1
                    className="mt-5 text-[52px] font-extrabold text-white tracking-tight drop-shadow-lg"
                    style={{ fontFamily: "'Baloo 2', cursive" }}
                >
                    Lúdix.
                </h1>
                <p className="mt-2 text-center text-white/80 text-sm leading-relaxed">
                    Tu espacio de aprendizaje
                    <br />
                    creativo y divertido 🎨
                </p>

                {/* Puntos decorativos */}
                <div className="absolute bottom-7 right-7 grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    ))}
                </div>
            </div>

            {/* Panel derecho */}
            <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
                <div className="w-full max-w-sm">{children}</div>
            </div>
        </div>
    );
}
