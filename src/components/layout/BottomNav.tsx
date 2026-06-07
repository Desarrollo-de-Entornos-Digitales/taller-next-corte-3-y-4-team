'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, Trophy, User } from 'lucide-react';

const navItems = [
    { name: 'Inicio', path: '/feed', icon: Home },
    { name: 'Catálogo', path: '/catalog', icon: BookOpen },
    { name: 'Logros', path: '/achievements', icon: Trophy },
    { name: 'Perfil', path: '/profile', icon: User },
];

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            style={{
                background: '#EDE8DC',
                borderTop: '2.5px solid #1A1A1A',
                fontFamily: 'Nunito, sans-serif',
            }}
        >
            <div className="flex justify-around py-2 px-2 gap-1">
                {navItems.map(({ name, path, icon: Icon }) => {
                    const active = pathname === path;
                    return (
                        <button
                            key={path}
                            onClick={() => router.push(path)}
                            className="flex flex-col items-center py-1.5 px-3 rounded-[12px] transition-all duration-150 flex-1"
                            style={
                                active
                                    ? {
                                          background: '#8B5BDB',
                                          color: '#fff',
                                          fontWeight: 800,
                                          border: '2px solid #1A1A1A',
                                          boxShadow: '3px 3px 0px #1A1A1A',
                                      }
                                    : {
                                          background: 'transparent',
                                          color: '#888899',
                                          fontWeight: 600,
                                          border: '2px solid transparent',
                                      }
                            }
                        >
                            <Icon size={22} />
                            <span className="text-xs mt-0.5">{name}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}