'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNotifications } from '@/context/NotificationContext';
import { ArrowLeft, MessageCircle, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import UserModal from '@/components/ui/UserModal';

interface Exercise {
    id: number;
    name: string;
    description: string;
    duration: number;
    exerciseTypeId: number;
    exerciseType?: { id: number; type: string };
    instructions?: string[];
}

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
    };
}

// Mapa de imágenes por ID de ejercicio
const getExerciseImage = (exerciseId: number): string => {
    const images: Record<number, string> = {
        1: '/crazy8.png',
        2: '/scamper.png',
        3: '/estiramiento-de-manos.png',
        4: '/dibujo-a-ciegas.png',
        5: '/mapa-mental.png',
        6: '/pausa-de-ojos.png',
    };
    return images[exerciseId] || '/default-exercise.png';
};

export default function ExerciseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUserName, setSelectedUserName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.sub;

                // 1. Cargar ejercicio
                const exerciseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const exerciseData = await exerciseRes.json();

                // Procesar instrucciones
                let instructionsArray = exerciseData.instructions;
                if (typeof instructionsArray === 'string') {
                    try {
                        instructionsArray = JSON.parse(instructionsArray);
                    } catch {
                        instructionsArray = [instructionsArray];
                    }
                }
                if (!instructionsArray || instructionsArray.length === 0) {
                    instructionsArray = [
                        'Encuentra un lugar tranquilo y sin distracciones.',
                        'Lee la descripción del ejercicio con atención.',
                        'Realiza el ejercicio a tu propio ritmo.',
                        'Al finalizar, reflexiona sobre cómo te sientes.',
                    ];
                }
                exerciseData.instructions = instructionsArray;
                setExercise(exerciseData);

                // 2. Verificar favorito
                const favRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const favData = await favRes.json();
                const favoritesArray = Array.isArray(favData) ? favData : favData.data || [];
                setIsFavorite(favoritesArray.some((fav: any) => fav.exerciseId === Number(id)));

                // 3. Verificar si ya completó el ejercicio
                const historyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercise-history/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const historyData = await historyRes.json();
                const historyArray = Array.isArray(historyData) ? historyData : historyData.data || [];
                setHasCompleted(
                    historyArray.some((h: any) => {
                        const exId = h.exercise?.id || h.exerciseId;
                        return exId === Number(id);
                    }),
                );

                // 4. Cargar comentarios
                const commentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/exercise/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let commentsData = await commentsRes.json();
                if (commentsData && !Array.isArray(commentsData)) {
                    commentsData = commentsData.data || [];
                }
                setComments(commentsData);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar el ejercicio', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, router, showNotification]);

    const toggleFavorite = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('Debes iniciar sesión', 'error');
                return;
            }
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.sub;

            if (isFavorite) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${userId}/exercise/${id}`,
                    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
                );
                if (response.ok) {
                    setIsFavorite(false);
                    showNotification('Eliminado de favoritos', 'success');
                } else throw new Error();
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ userId, exerciseId: Number(id) }),
                });
                if (response.ok) {
                    setIsFavorite(true);
                    showNotification('Agregado a favoritos', 'success');
                } else throw new Error();
            }
        } catch {
            showNotification('Error al actualizar favoritos', 'error');
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const payload = JSON.parse(atob(token!.split('.')[1]));
            const userId = payload.sub;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ userId, exerciseId: Number(id), content: newComment }),
            });
            if (response.ok) {
                const newCommentData = await response.json();
                setComments([newCommentData, ...comments]);
                setNewComment('');
                showNotification('Comentario agregado', 'success');
            } else throw new Error();
        } catch {
            showNotification('Error al agregar comentario', 'error');
        }
    };

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#8B5BDB] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-semibold">Cargando ejercicio...</p>
                </div>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className="min-h-screen bg-[#8B5BDB] flex items-center justify-center">
                <p className="text-white">Ejercicio no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            {/* Panel principal — card flotante */}
            <div
                className="w-full max-w-4xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-5 sm:p-6 md:p-8">
                    {/* Botón volver */}
                    <button
                        onClick={() => router.back()}
                        className="mb-5 text-gray-500 hover:text-purple-600 transition flex items-center gap-1"
                    >
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </button>

                    {/* Título centrado */}
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight text-center">
                        {exercise.name}
                    </h1>

                    {/* Descripción centrada */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 text-center max-w-2xl mx-auto">
                        {exercise.description}
                    </p>

                    {/* Imagen del ejercicio personalizada */}
                    <div className="relative w-full h-48 md:h-64 bg-[#e8e0f0] rounded-2xl flex items-center justify-center mb-6 border-2 border-black overflow-hidden">
                        <img
                            src={getExerciseImage(exercise.id)}
                            alt={exercise.name}
                            className="w-full h-full object-contain p-4"
                        />
                        <button
                            onClick={toggleFavorite}
                            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center border-2 border-black transition-transform hover:scale-110 active:scale-95 ${
                                isFavorite ? 'bg-red-50' : 'bg-white'
                            }`}
                        >
                            <Heart
                                size={18}
                                className={isFavorite ? 'text-red-500' : 'text-gray-400'}
                                fill={isFavorite ? 'currentColor' : 'none'}
                                strokeWidth={2.5}
                            />
                        </button>
                    </div>

                    {/* Tipo y duración */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            {exercise.exerciseType?.type || 'Ejercicio'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            ⏱ {exercise.duration} min
                        </span>
                    </div>

                    {/* Instrucciones */}
                    <div className="bg-white rounded-xl p-5 mb-6 border-2 border-black">
                        <p className="text-sm font-extrabold text-gray-700 mb-3">📋 Instrucciones</p>
                        <ul className="space-y-2.5">
                            {exercise.instructions?.map((inst: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 leading-snug">
                                    <span className="min-w-[20px] h-5 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center mt-0.5 flex-shrink-0">
                                        {idx + 1}
                                    </span>
                                    {inst}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Botón comenzar */}
                    <button
                        onClick={() => router.push(`/exercises/${exercise.id}/timer`)}
                        className="w-full py-3.5 rounded-full font-black text-white text-base bg-purple-600 hover:bg-purple-700 border-2 border-black transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Comenzar ahora
                    </button>

                    {/* Sección comentarios */}
                    <div className="mt-6 bg-white rounded-xl border-2 border-black overflow-hidden">
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#faf9f6] transition"
                        >
                            <div className="flex items-center gap-3">
                                <MessageCircle size={18} className="text-purple-600" />
                                <span className="text-sm font-extrabold text-gray-800">
                                    Comentarios de la comunidad
                                </span>
                            </div>
                            {showComments ? (
                                <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                                <ChevronDown size={16} className="text-gray-400" />
                            )}
                        </button>

                        {showComments && (
                            <div className="px-5 pb-5 border-t border-gray-100">
                                {!hasCompleted ? (
                                    <div className="flex flex-col items-center gap-1.5 py-6 text-center">
                                        <span className="text-3xl">🔒</span>
                                        <p className="text-sm font-bold text-gray-500">
                                            Completa este ejercicio para desbloquear
                                        </p>
                                        <p className="text-xs text-gray-400">los comentarios de la comunidad</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex gap-2 pt-4 mb-4">
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                                placeholder="Escribe tu comentario..."
                                                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                                            />
                                            <button
                                                onClick={handleAddComment}
                                                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black border-2 border-black transition"
                                            >
                                                Publicar
                                            </button>
                                        </div>

                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {comments.length === 0 ? (
                                                <p className="text-sm text-gray-400 text-center py-4">
                                                    No hay comentarios aún. ¡Sé el primero! 🌟
                                                </p>
                                            ) : (
                                                comments.map((comment) => (
                                                    <div key={comment.id} className="bg-[#f5f2eb] rounded-xl p-3">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                                                                {getInitials(comment.user?.name || 'U')}
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUserId(comment.user.id);
                                                                    setSelectedUserName(comment.user.name);
                                                                }}
                                                                className="text-xs font-black text-gray-700 hover:text-purple-600 hover:underline cursor-pointer"
                                                            >
                                                                {comment.user?.name || 'Usuario'}
                                                            </button>
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 leading-snug pl-9">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de usuario */}
            <UserModal
                userId={selectedUserId || 0}
                userName={selectedUserName}
                isOpen={selectedUserId !== null}
                onClose={() => setSelectedUserId(null)}
            />
        </div>
    );
}
