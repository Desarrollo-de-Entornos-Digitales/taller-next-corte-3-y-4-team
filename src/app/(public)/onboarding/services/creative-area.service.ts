import axiosClient from '../../../../lib/axios/client';

export interface CreativeArea {
    id: number;
    area: string;
}

class CreativeAreaService {
    async getCreativeAreas(): Promise<CreativeArea[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const result = await axiosClient.get('/creative-areas', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return result.data;
    }
}

export const creativeAreaService = new CreativeAreaService();
