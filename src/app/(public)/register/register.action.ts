'use server';

import { cookies } from 'next/headers';
import { registerService } from './services/register.service';

export default async function registerAction(name: string, email: string, password: string) {
    const result = await registerService.register(name, email, password);
    const cookieStore = await cookies();
    cookieStore.set('token', result.access_token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 semana
    });
    return result;
}
