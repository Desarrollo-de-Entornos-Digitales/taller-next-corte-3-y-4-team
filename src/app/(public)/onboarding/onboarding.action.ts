'use server';

import axiosClient from '../../../lib/axios/client';

import { creativeAreaService } from './services/creative-area.service';

interface ProfileResponse {
    id: number;
    userId: number;
    creativeAreaId: number;
}

export default async function onboardingAction(creativeAreaId: number, userId: number) {
    const areas = await creativeAreaService.getCreativeAreas();
    const areaExists = areas.some((area) => area.id === creativeAreaId);

    if (!areaExists) {
        throw new Error('Área creativa no válida');
    }

    const result = await axiosClient.post<ProfileResponse>('/profiles', {
        userId,
        creativeAreaId,
    });

    return result.data;
}
