'use server';

import axiosClient from '../../../lib/axios/client';

interface ProfileResponse {
    id: number;
    userId: number;
    creativeAreaId: number;
}

export default async function onboardingAction(creativeAreaId: number, userId: number, token: string) {
    const result = await axiosClient.post<ProfileResponse>(
        '/profiles',
        {
            userId,
            creativeAreaId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return result.data;
}
