'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNotifications } from '@/context/NotificationContext';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function TimerPage() {
    const { id } = useParams();
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [exerciseName, setExerciseName] = useState('');
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(true);
    const [showExitModal, setShowExitModal] = useState(false);

    // Cargar datos del ejercicio
    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setExerciseName(data.name);
                const seconds = data.duration * 60;
                setTotalSeconds(seconds);
                setTimeLeft(seconds);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar el ejercicio', 'error');
                router.push('/feed');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchExercise();
    }, [id, router, showNotification]);

    // Guardar progreso al completar
    const handleComplete = useCallback(async () => {
        setIsActive(false);
        try {
            const token = localStorage.getItem('token');
            const userId = JSON.parse(atob(token!.split('.')[1])).sub;
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    exerciseId: Number(id),
                    completedAt: new Date().toISOString(),
                }),
            });
            showNotification('¡Ejercicio completado!', 'success');
            router.push(`/exercises/${id}/feedback`);
        } catch (error) {
            console.error(error);
            showNotification('Error al guardar el progreso', 'error');
            router.push(`/exercises/${id}`);
        }
    }, [id, router, showNotification]);

    // Temporizador real
    useEffect(() => {
        if (!isActive || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft, handleComplete]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EDE8DC] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700 flex flex-col items-center justify-center p-5">
            <div className="text-center w-full max-w-md relative">
                {/* Botón cerrar (X) */}
                <button
                    onClick={() => setShowExitModal(true)}
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition flex items-center justify-center"
                    aria-label="Salir del ejercicio"
                >
                    ✕
                </button>

                <h2 className="text-white text-xl mb-2">{exerciseName}</h2>

                {/* Círculo de progreso */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="128" cy="128" r="110" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                        <circle
                            cx="128"
                            cy="128"
                            r="110"
                            stroke="#fff"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 110}`}
                            strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress / 100)}`}
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-5xl md:text-6xl font-mono font-bold text-white">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="text-white/60 text-sm mt-2">{Math.floor(progress)}% completado</div>
                    </div>
                </div>

                {/* Controles */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className="px-8 py-3 rounded-full font-bold bg-white text-purple-700 border-2 border-black shadow-[3px_3px_0px_#1A1A1A] hover:bg-gray-100 transition"
                    >
                        {isActive ? 'Pausar' : 'Reanudar'}
                    </button>
                    <button
                        onClick={handleComplete}
                        className="px-8 py-3 rounded-full font-bold bg-teal-400 text-white hover:bg-teal-500 transition shadow-lg"
                    >
                        Terminar
                    </button>
                </div>

                <p className="text-purple-200 text-sm mt-8">Respira profundo y concéntrate en el ejercicio</p>
            </div>

            {/* Modal de confirmación reutilizable */}
            <ConfirmationModal
                isOpen={showExitModal}
                title="¿Salir del ejercicio?"
                message="Tu progreso no se guardará si sales ahora."
                confirmText="Salir"
                cancelText="Continuar"
                variant="danger"
                onConfirm={() => router.push('/feed')}
                onCancel={() => setShowExitModal(false)}
            />
        </div>
    );
}
