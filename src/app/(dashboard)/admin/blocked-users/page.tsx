'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Ban, UserCheck, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface User {
    id: number;
    email: string;
    name: string;
    rolId: number;
    rol?: { id: number; name: string };
}

interface BlockedUser {
    id: number;
    userId: number;
    reason: string;
    blockedAt: string;
    isActive: boolean;
    user?: User;
}

export default function AdminBlockedUsersPage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [users, setUsers] = useState<User[]>([]);
    const [blockedUsers, setBlockedUsers] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [blockReason, setBlockReason] = useState('');
    const [showBlockModal, setShowBlockModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Cargar todos los usuarios
                const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let usersData = await usersRes.json();
                usersData = Array.isArray(usersData) ? usersData : usersData.data || [];
                setUsers(usersData);

                // Cargar usuarios bloqueados activos
                const blockedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blocked-users?isActive=true`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                let blockedData = await blockedRes.json();
                const blockedList = blockedData.data || (Array.isArray(blockedData) ? blockedData : []);

                const blockedSet = new Set(blockedList.map((b: BlockedUser) => b.userId));
                setBlockedUsers(blockedSet);
            } catch (error) {
                console.error(error);
                showNotification('Error al cargar datos', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, showNotification]);

    const handleBlockUser = async () => {
        if (!selectedUser) return;
        if (!blockReason.trim()) {
            showNotification('Debes escribir una razón para bloquear', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const payload = JSON.parse(atob(token!.split('.')[1]));
            const adminId = payload.sub;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blocked-users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    blockedBy: adminId,
                    reason: blockReason,
                    blockedAt: new Date().toISOString(),
                    isActive: true,
                }),
            });

            if (response.ok) {
                setBlockedUsers((prev) => new Set(prev).add(selectedUser.id));
                showNotification(`Usuario ${selectedUser.name} bloqueado`, 'success');
                setShowBlockModal(false);
                setSelectedUser(null);
                setBlockReason('');
            } else {
                throw new Error();
            }
        } catch {
            showNotification('Error al bloquear usuario', 'error');
        }
    };

    const handleUnblockUser = async (user: User) => {
        if (!confirm(`¿Desbloquear al usuario "${user.name}"?`)) return;

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blocked-users/unblock/${user.id}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setBlockedUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(user.id);
                    return newSet;
                });
                showNotification(`Usuario ${user.name} desbloqueado`, 'success');
            } else {
                throw new Error();
            }
        } catch {
            showNotification('Error al desbloquear usuario', 'error');
        }
    };

    const openBlockModal = (user: User) => {
        if (user.id === 1) {
            showNotification('No puedes bloquear al administrador principal', 'error');
            return;
        }
        setSelectedUser(user);
        setBlockReason('');
        setShowBlockModal(true);
    };

    if (loading) {
        return (
            <div
                className="min-h-screen font-[Nunito,sans-serif] flex items-center justify-center"
                style={{ background: '#8B5BDB' }}
            >
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-semibold">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            <div className="flex items-center justify-between mb-6 w-full max-w-6xl mx-auto px-1">
                <button onClick={() => router.back()} className="text-white hover:text-purple-200 transition">
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-black text-white">Bloquear usuarios</h1>
                <div className="w-6" />
            </div>

            <div
                className="w-full max-w-6xl mx-auto rounded-[28px] overflow-hidden"
                style={{
                    background: '#F5F1E8',
                    border: '2.5px solid #1A1A1A',
                    boxShadow: '6px 6px 0px #1A1A1A',
                }}
            >
                <div className="p-6">
                    <p className="text-gray-500 mb-4">
                        {users.length} usuarios registrados | {blockedUsers.size} bloqueados
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b-2 border-black">
                                <tr>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">ID</th>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">Nombre</th>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">Email</th>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">Rol</th>
                                    <th className="text-left py-3 px-2 text-gray-700 font-bold">Estado</th>
                                    <th className="text-center py-3 px-2 text-gray-700 font-bold">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => {
                                    const isBlocked = blockedUsers.has(user.id);
                                    const isAdmin = user.rolId === 1;

                                    return (
                                        <tr key={user.id} className="border-b border-gray-200">
                                            <td className="py-3 px-2 font-mono text-gray-900">{user.id}</td>
                                            <td className="py-3 px-2 font-semibold text-gray-900">{user.name}</td>
                                            <td className="py-3 px-2 text-gray-600">{user.email}</td>
                                            <td className="py-3 px-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        isAdmin
                                                            ? 'bg-purple-200 text-purple-800'
                                                            : 'bg-gray-200 text-gray-800'
                                                    }`}
                                                >
                                                    {user.rol?.name || (isAdmin ? 'admin' : 'user')}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2">
                                                {isBlocked ? (
                                                    <span className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                                                        <Ban size={14} /> Bloqueado
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                                                        <UserCheck size={14} /> Activo
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                {!isAdmin && (
                                                    <>
                                                        {isBlocked ? (
                                                            <button
                                                                onClick={() => handleUnblockUser(user)}
                                                                className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition"
                                                            >
                                                                Desbloquear
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => openBlockModal(user)}
                                                                className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition"
                                                            >
                                                                Bloquear
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                {isAdmin && <span className="text-xs text-gray-500">Admin</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para bloquear usuario */}
            {showBlockModal && selectedUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowBlockModal(false)}
                >
                    <div
                        className="w-full max-w-md mx-4 rounded-[28px] overflow-hidden"
                        style={{
                            background: '#F5F1E8',
                            border: '2.5px solid #1A1A1A',
                            boxShadow: '6px 6px 0px #1A1A1A',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Ban size={24} className="text-red-500" />
                                <h3 className="text-lg font-black text-gray-900">Bloquear usuario</h3>
                            </div>
                            <p className="text-gray-600 mb-4">
                                ¿Estás seguro de que quieres bloquear a{' '}
                                <span className="font-bold">{selectedUser.name}</span>?
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Razón del bloqueo</label>
                                <textarea
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                                    placeholder="Ej: Comportamiento inapropiado, Spam, etc."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowBlockModal(false)}
                                    className="flex-1 py-3 rounded-xl font-black text-gray-700 bg-white border-2 border-black transition-all hover:-translate-y-0.5"
                                    style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleBlockUser}
                                    className="flex-1 py-3 rounded-xl font-black text-white bg-red-500 border-2 border-black transition-all hover:bg-red-600 hover:-translate-y-0.5"
                                    style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                                >
                                    Bloquear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
