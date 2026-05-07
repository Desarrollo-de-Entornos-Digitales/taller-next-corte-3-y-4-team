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
    <header
      className="sticky top-0 z-50"
      style={{ background: "#EDE8DC", borderBottom: "2.5px solid #1A1A1A" }}
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
        
        {/* Logo y nombre */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-transform duration-150 hover:scale-105"
          onClick={() => router.push("/feed")}
        >
          <span className="text-2xl">🎨</span>
          <span className="text-xl font-black tracking-tight" style={{ color: "#1C1C1C" }}>
            Lúdix
          </span>
        </div>

        {/* Avatar y menú */}
        {showAvatar && (
          <div className="relative group">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5"
              style={{
                background: "#8B5BDB",
                border: "2px solid #1A1A1A",
                boxShadow: "3px 3px 0px #1A1A1A",
              }}
            >
              <span className="text-white text-lg">👤</span>
            </button>
            
            {/* Menú desplegable */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
              style={{
                border: "2px solid #1A1A1A",
                boxShadow: "4px 4px 0px #1A1A1A",
              }}
            >
              <div className="py-2">
                <p className="px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition"
                  style={{ color: "#1C1C1C" }}
                  onClick={() => router.push("/profile")}
                >
                  Mi perfil
                </p>
                <p className="px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-gray-100 transition"
                  style={{ color: "#1C1C1C" }}
                >
                  Configuración
                </p>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-semibold transition"
                  style={{ color: "#E05C3A" }}
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