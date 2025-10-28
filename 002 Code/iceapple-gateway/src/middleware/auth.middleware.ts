import type { Handler } from 'express';
import { getEnv } from '@/common/env';

const { AUTH_BASE_URL } = getEnv();

export const authMiddleware: Handler = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res
                .status(401)
                .json({ message: 'Authorization header is required.' });
        }

        console.log('[AuthMiddleware] 인증서버로 인증 요청...');
        const response = await fetch(`${AUTH_BASE_URL}/validate`, {
            method: 'POST',
            headers: {
                Authorization: authorization,
            },
        });

        const body = await response.json();

        console.log('인증 결과', body);

        if (!response.ok)
            return res.status(401).json({ message: body.message });

        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
