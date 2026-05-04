'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginResponse {
    access_token: string;
}

export default function TempLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('admin@ludix.com');
    const [password, setPassword] = useState('admin123');

    const handleLogin = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
            console.info('Attempting login to:', url);

            const res = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            console.info('Response status:', res.status);

            if (!res.ok) {
                const text = await res.text();
                console.error('Login failed with status:', res.status);
                console.error('Response body:', text);
                throw new Error(`Login failed: ${res.status} ${text}`);
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const data: LoginResponse = await res.json();
            localStorage.setItem('token', data.access_token);
            router.push('/onboarding');
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                alert(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100">
            <div className="bg-white p-8 rounded-2xl w-96">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Login temporal</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded mb-2 text-gray-800"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-4 text-gray-800"
                />
                <button
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={handleLogin}
                    className="w-full bg-purple-600 text-white py-2 rounded"
                >
                    Iniciar sesión
                </button>
            </div>
        </div>
    );
}
