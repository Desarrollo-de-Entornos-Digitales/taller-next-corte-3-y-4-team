'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Key, Check, X, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface Rol {
    id: number;
    name: string;
    description: string;
}

interface Permission {
    id: number;
    name: string;
    description: string;
}

interface RolPermission {
    id: number;
    rolId: number;
    permissionId: number;
}

export default function AdminPermissionsPage() {
    const router = useRouter();
    const { showNotification } = useNotifications();
    const [roles, setRoles] = useState<Rol[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [rolPermissions, setRolPermissions] = useState<RolPermission[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedRolId, setSelectedRolId] = useState<number>(1);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Cargar roles
            const rolesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rol`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let rolesData = await rolesRes.json();
            if (rolesData && !Array.isArray(rolesData)) {
                rolesData = rolesData.data || [];
            }
            setRoles(rolesData);
            if (rolesData.length > 0 && selectedRolId === 1) {
                setSelectedRolId(rolesData[0].id);
            }

            // Cargar permisos
            const permsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permissions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let permsData = await permsRes.json();
            if (permsData && !Array.isArray(permsData)) {
                permsData = permsData.data || [];
            }
            setPermissions(permsData);

            // Cargar asignaciones rol-permiso
            const rpRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rol-permissions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let rpData = await rpRes.json();
            if (rpData && !Array.isArray(rpData)) {
                rpData = rpData.data || [];
            }
            setRolPermissions(rpData);
        } catch (error) {
            console.error(error);
            showNotification('Error al cargar datos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissionsForRol = async (rolId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rol-permissions/rol/${rolId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let data = await response.json();
            if (data && !Array.isArray(data)) {
                data = data.data || [];
            }
            setRolPermissions((prev) => {
                const otherRoles = prev.filter((rp) => rp.rolId !== rolId);
                return [...otherRoles, ...data];
            });
        } catch (error) {
            console.error(error);
        }
    };

    const hasPermission = (permissionId: number): boolean => {
        return rolPermissions.some((rp) => rp.rolId === selectedRolId && rp.permissionId === permissionId);
    };

    const togglePermission = async (permissionId: number, currentState: boolean) => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');

            if (currentState) {
                // Eliminar permiso
                const existing = rolPermissions.find(
                    (rp) => rp.rolId === selectedRolId && rp.permissionId === permissionId,
                );
                if (existing) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rol-permissions/${existing.id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.ok) {
                        setRolPermissions((prev) => prev.filter((rp) => rp.id !== existing.id));
                        showNotification('Permiso removido', 'success');
                    } else {
                        throw new Error();
                    }
                }
            } else {
                // Agregar permiso
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rol-permissions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        rolId: selectedRolId,
                        permissionId: permissionId,
                    }),
                });
                if (response.ok) {
                    const newRp = await response.json();
                    setRolPermissions((prev) => [...prev, newRp]);
                    showNotification('Permiso asignado', 'success');
                } else {
                    throw new Error();
                }
            }
        } catch {
            showNotification('Error al cambiar permiso', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleRolChange = (rolId: number) => {
        setSelectedRolId(rolId);
        fetchPermissionsForRol(rolId);
    };

    if (loading) {
        return (
            <div
                className="min-h-screen font-[Nunito,sans-serif] flex items-center justify-center"
                style={{ background: '#8B5BDB' }}
            >
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-semibold">Cargando permisos...</p>
                </div>
            </div>
        );
    }

    const currentRol = roles.find((r) => r.id === selectedRolId);
    const assignedCount = permissions.filter((p) => hasPermission(p.id)).length;

    return (
        <div className="min-h-screen font-[Nunito,sans-serif] p-4 md:p-6" style={{ background: '#8B5BDB' }}>
            <div className="flex items-center justify-between mb-6 w-full max-w-6xl mx-auto px-1">
                <button onClick={() => router.back()} className="text-white hover:text-purple-200 transition">
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-black text-white">Gestión de permisos</h1>
                <button
                    onClick={() => fetchData()}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black bg-white text-purple-600 border-2 border-black transition-all hover:-translate-y-0.5"
                    style={{ boxShadow: '3px 3px 0px #1A1A1A' }}
                >
                    <RefreshCw size={16} /> Actualizar
                </button>
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
                    {/* Selector de roles */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Seleccionar rol</label>
                        <div className="flex flex-wrap gap-3">
                            {roles.map((rol) => (
                                <button
                                    key={rol.id}
                                    onClick={() => handleRolChange(rol.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-black transition-all ${
                                        selectedRolId === rol.id
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100'
                                    }`}
                                    style={{
                                        boxShadow: selectedRolId === rol.id ? '3px 3px 0px #1A1A1A' : 'none',
                                        border: selectedRolId === rol.id ? '2px solid #1A1A1A' : '2px solid #E5E7EB',
                                    }}
                                >
                                    {rol.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info del rol seleccionado */}
                    <div className="mb-6 p-4 bg-white rounded-xl border-2 border-black">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Rol seleccionado</p>
                                <p className="text-xl font-black text-gray-900">{currentRol?.name}</p>
                                <p className="text-sm text-gray-500">{currentRol?.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Permisos asignados</p>
                                <p className="text-2xl font-black text-purple-600">{assignedCount}</p>
                                <p className="text-xs text-gray-400">de {permissions.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Lista de permisos */}
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-700 mb-3">Permisos disponibles</p>
                        <div className="max-h-[500px] overflow-y-auto space-y-2">
                            {permissions.map((permission) => {
                                const isAssigned = hasPermission(permission.id);
                                return (
                                    <div
                                        key={permission.id}
                                        className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Shield size={18} className="text-purple-500" />
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{permission.name}</p>
                                                {permission.description && (
                                                    <p className="text-xs text-gray-500">{permission.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => togglePermission(permission.id, isAssigned)}
                                            disabled={saving}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                                isAssigned
                                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                        >
                                            {isAssigned ? (
                                                <span className="flex items-center gap-1">
                                                    <Check size={12} /> Asignado
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <X size={12} /> No asignado
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
