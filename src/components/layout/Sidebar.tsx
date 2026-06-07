'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Home, BookOpen, Trophy, User } from 'lucide-react';

const navItems = [
    { name: 'Inicio', path: '/feed', icon: Home },
    { name: 'Catálogo', path: '/catalog', icon: BookOpen },
    { name: 'Logros', path: '/achievements', icon: Trophy },
    { name: 'Perfil', path: '/profile', icon: User },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <aside
            className="hidden md:flex md:flex-col md:w-64 md:min-h-screen md:fixed md:left-0 md:top-0 md:z-40"
            style={{
                background: '#8B5BDB',
                fontFamily: 'Nunito, sans-serif',
            }}
        >
            <div className="p-6 flex flex-col h-full">
                {/* Logo */}
                <div className="flex justify-center mb-10 cursor-pointer" onClick={() => router.push('/feed')}>
                    <Image src="/logo-ludix.png" alt="Lúdix Logo" width={240} height={240} className="object-contain" />
                </div>

                {/* Nav */}
                <nav className="space-y-2">
                    {navItems.map(({ name, path, icon: Icon }) => {
                        const active = pathname === path;
                        return (
                            <button
                                key={path}
                                onClick={() => router.push(path)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-left transition-all duration-150"
                                style={
                                    active
                                        ? {
                                              background: 'rgba(255,255,255,0.2)',
                                              color: '#fff',
                                              fontWeight: 800,
                                              border: '2px solid rgba(255,255,255,0.5)',
                                          }
                                        : {
                                              background: 'transparent',
                                              color: 'rgba(255,255,255,0.65)',
                                              fontWeight: 600,
                                              border: '2px solid transparent',
                                          }
                                }
                            >
                                <Icon size={20} />
                                <span>{name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}