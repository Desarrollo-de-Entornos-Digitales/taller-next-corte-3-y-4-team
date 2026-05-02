import axiosClient from '../../../../lib/axios/client';

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
        const result = await axiosClient.post('/auth/login', { email, password });
        return result.data;
    }
}

export const loginService = new LoginService();
