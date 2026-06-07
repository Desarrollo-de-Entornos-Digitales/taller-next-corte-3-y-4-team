'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import { useNotifications } from '@/context/NotificationContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthAndBlock = async () => {
            const token = localStorage.getItem('token');
            console.log('🔍 Token encontrado:', token ? 'Sí' : 'No');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.sub;
                console.log('👤 Usuario ID:', userId);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blocked-users/check/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('📡 Respuesta del endpoint de bloqueo:', response.status);

                if (response.ok) {
                    const blockedData = await response.json();
                    console.log('📦 Datos de bloqueo:', blockedData);

                    if (blockedData.isBlocked === true) {
                        console.log('🚫 Usuario bloqueado, cerrando sesión');
                        localStorage.removeItem('token');
                        showNotification(blockedData.message || 'Tu cuenta ha sido bloqueada', 'error');
                        router.push('/login');
                        return;
                    }
                }
            } catch (error) {
                console.error('❌ Error verificando bloqueo:', error);
            }

            setIsLoading(false);
        };

        checkAuthAndBlock();
    }, [router, showNotification]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#8B5BDB] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#8B5BDB]">
            <Sidebar />
            <div className="md:ml-64">
                <main className="pb-20 md:pb-0">{children}</main>
                <BottomNav />
            </div>
        </div>
    );
}