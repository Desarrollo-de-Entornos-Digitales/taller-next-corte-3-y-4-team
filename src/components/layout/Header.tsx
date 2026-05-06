"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  showAvatar?: boolean;
}

export default function Header({ showAvatar = true }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo y nombre */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/feed")}>
          <span className="text-2xl">🎨</span>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Lúdix
          </span>
        </div>

        {/* Avatar y menú */}
        {showAvatar && (
          <div className="relative group">
            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-md hover:scale-105 transition">
              👤
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block">
              <div className="py-2">
                <p className="px-4 py-2 text-sm text-gray-700 border-b">Mi perfil</p>
                <p className="px-4 py-2 text-sm text-gray-700 border-b">Configuración</p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}