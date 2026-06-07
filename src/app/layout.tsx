import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from '@/context/NotificationContext';
import { LoadingProvider } from '@/context/LoadingContext';
import Toast from '@/components/ui/Toast';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Lúdix',
    description: 'Tu espacio de aprendizaje creativo',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <LoadingProvider>
                    <NotificationProvider>
                        {children}
                        <Toast />
                    </NotificationProvider>
                </LoadingProvider>
            </body>
        </html>
    );
}
