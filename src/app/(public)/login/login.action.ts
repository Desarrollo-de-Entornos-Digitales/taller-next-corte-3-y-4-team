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

    const cookieStore = await cookies();
    cookieStore.set('token', result.access_token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    return result;
}
