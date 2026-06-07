'use server';

import { cookies } from 'next/headers';

interface LoginResponse {
    access_token: string;
    user: {
        id: number;
        email: string;
        name: string;
        rolId: number;
        rol: string;
        permissions: string[];
    };
}

export default async function loginAction(email: string, password: string) {
    // 1. Intentar login
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en el login');
    }

    const result: LoginResponse = await response.json();

    // 2. Verificar si el usuario está bloqueado
    const blockedCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blocked-users/check/${result.user.id}`, {
        headers: {
            Authorization: `Bearer ${result.access_token}`,
            'Content-Type': 'application/json',
        },
    });

    if (blockedCheck.ok) {
        const blockedData = await blockedCheck.json();

        if (blockedData.isBlocked === true) {
            // Lanzar error específico para usuario bloqueado
            throw new Error('🔒 Estás bloqueado. Contacta al administrador.');
        }
    }

    // 3. Guardar token en cookie
    const cookieStore = await cookies();
    cookieStore.set('token', result.access_token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    return result;
}
