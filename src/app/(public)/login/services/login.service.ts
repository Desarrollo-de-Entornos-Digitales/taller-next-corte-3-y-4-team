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

class LoginService {
    async login(email: string, password: string): Promise<LoginResponse> {
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

        return response.json();
    }
}

export const loginService = new LoginService();
