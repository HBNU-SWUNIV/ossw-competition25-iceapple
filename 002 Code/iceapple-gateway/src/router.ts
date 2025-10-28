import express from 'express';
import { authMiddleware } from '@/middleware/auth.middleware';
import {
    adminHomeProxy,
    adminNoticeProxy,
    adminPlaceProxy,
    adminProjectProxy,
    authProxy,
    homeProxy,
    noticeProxy,
    placeProxy,
    projectProxy,
} from '@/proxies';

const proxyRouter = express.Router();

proxyRouter.use('/home', homeProxy);
proxyRouter.use('/project', projectProxy);
proxyRouter.use('/place', placeProxy);
proxyRouter.use('/notice', noticeProxy);
proxyRouter.use('/auth', authProxy);

const adminMiddlewares = [express.json(), authMiddleware];

proxyRouter.use('/admin/home', ...adminMiddlewares, adminHomeProxy);
proxyRouter.use('/admin/place', ...adminMiddlewares, adminPlaceProxy);
proxyRouter.use('/admin/notice', ...adminMiddlewares, adminNoticeProxy);
proxyRouter.use('/admin/project', ...adminMiddlewares, adminProjectProxy);

export default proxyRouter;