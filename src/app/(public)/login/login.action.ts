'use server';

import { cookies } from 'next/headers';

import { loginService } from './services/login.service';

export default async function loginAction(email: string, password: string) {
    const result = await loginService.login(email, password);
    const cookieStore = await cookies();
    cookieStore.set('token', result.access_token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 semana
    });
    return result;
}
