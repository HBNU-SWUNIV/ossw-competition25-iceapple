import type { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { getEnv } from '@/common/env';

const {
    HOME_BASE_URL,
    NOTICE_BASE_URL,
    PLACE_BASE_URL,
    PROJECT_BASE_URL,
    AUTH_BASE_URL,
} = getEnv();

const proxyErrorHandler = (err: Error, req: Request) => {
    console.error('[ERROR] 프록시 에러 발생');
    console.error(`요청 정보: ${req.method} ${req.url}`);
    console.error(`스택 트레이스: ${err.stack}`);
};

const cleanUpOnProxyRes = (proxyRes: Request, req: Request, res: Response) => {
    const cleanup = (err: Error) => {
        // cleanup event listeners to allow clean garbage collection
        proxyRes.removeListener('error', cleanup);
        proxyRes.removeListener('close', cleanup);
        res.removeListener('error', cleanup);
        res.removeListener('close', cleanup);

        // destroy all source streams to propagate the caught event backward
        req.destroy(err);
        proxyRes.destroy(err);
    };

    proxyRes.once('error', cleanup);
    proxyRes.once('close', cleanup);
    res.once('error', cleanup);
    res.once('close', cleanup);
};

export const homeProxy = createProxyMiddleware<Request, Response>({
    target: HOME_BASE_URL,
    logger: console,
    on: {
        proxyRes: (proxyRes, req, res) => {
            delete proxyRes.headers['transfer-encoding'];
            cleanUpOnProxyRes(proxyRes, req, res);
        },
        error: proxyErrorHandler,
    },
});

export const projectProxy = createProxyMiddleware<Request, Response>({
    target: PROJECT_BASE_URL,
    logger: console,
    on: {
        proxyRes: cleanUpOnProxyRes,
        error: proxyErrorHandler,
    },
});

export const placeProxy = createProxyMiddleware<Request, Response>({
    target: PLACE_BASE_URL,
    logger: console,
    on: {
        proxyRes: (proxyRes, req, res) => {
            delete proxyRes.headers['transfer-encoding'];
            cleanUpOnProxyRes(proxyRes, req, res);
        },
        error: proxyErrorHandler,
    },
});

export const noticeProxy = createProxyMiddleware<Request, Response>({
    target: NOTICE_BASE_URL,
    logger: console,
    on: {
        proxyRes: cleanUpOnProxyRes,
        error: proxyErrorHandler,
    },
});

export const authProxy = createProxyMiddleware<Request, Response>({
    target: AUTH_BASE_URL,
    logger: console,
    on: {
        error: proxyErrorHandler,
        proxyRes: (proxyRes, req, res) => {
            delete proxyRes.headers['transfer-encoding'];
            cleanUpOnProxyRes(proxyRes, req, res);
        },
    },
});

export const adminHomeProxy = createProxyMiddleware<Request, Response>({
    target: HOME_BASE_URL,
    pathRewrite: {
        '^': '/admin',
    },
    on: {
        error: proxyErrorHandler,
        proxyReq: fixRequestBody,
        proxyRes: (proxyRes, req, res) => {
            delete proxyRes.headers['transfer-encoding'];
            cleanUpOnProxyRes(proxyRes, req, res);
        },
    },
});

export const adminPlaceProxy = createProxyMiddleware<Request, Response>({
    target: PLACE_BASE_URL,
    pathRewrite: {
        '^': '/admin',
    },
    on: {
        error: proxyErrorHandler,
        proxyReq: fixRequestBody,
        proxyRes: (proxyRes, req, res) => {
            delete proxyRes.headers['transfer-encoding'];
            cleanUpOnProxyRes(proxyRes, req, res);
        },
    },
});

export const adminNoticeProxy = createProxyMiddleware<Request, Response>({
    target: NOTICE_BASE_URL,
    pathRewrite: {
        '^': '/admin',
    },
    on: {
        error: proxyErrorHandler,
        proxyReq: fixRequestBody,
        proxyRes: cleanUpOnProxyRes,
    },
});

export const adminProjectProxy = createProxyMiddleware<Request, Response>({
    target: PROJECT_BASE_URL,
    pathRewrite: {
        '^': '/admin',
    },
    on: {
        error: proxyErrorHandler,
        proxyReq: fixRequestBody,
        proxyRes: cleanUpOnProxyRes,
    },
});
