import axiosClient from '@app/utils/axios-client';

export interface CreativeArea {
    id: number;
    area: string;
}

class CreativeAreaService {
    async getCreativeAreas(): Promise<CreativeArea[]> {
        const result = await axiosClient.get('/creative-areas');
        return result.data;
    }
}

export const creativeAreaService = new CreativeAreaService();
