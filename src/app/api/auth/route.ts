import { NextResponse } from 'next/server';

const VALID_EMAIL = 'admin@ludix.com';
const VALID_PASSWORD = 'admin123';

function toBase64(value: string) {
    return Buffer.from(value).toString('base64');
}

function createDummyToken(userId: number) {
    const header = toBase64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = toBase64(JSON.stringify({ sub: userId, email: VALID_EMAIL }));
    const signature = toBase64('signature');
    return `${header}.${payload}.${signature}`;
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body as { email?: string; password?: string };

    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
        return NextResponse.json(
            {
                message: 'Credenciales inválidas',
                error: 'Unauthorized',
                statusCode: 401,
            },
            { status: 401 },
        );
    }

    const access_token = createDummyToken(1);
    return NextResponse.json({ access_token });
}
