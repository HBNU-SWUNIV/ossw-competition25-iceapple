import v8 from 'node:v8';
import cors from 'cors';
import express from 'express';
import { getEnv } from '@/common/env';
import { requestLogger } from '@/middleware/request-logger.ts';
import proxyRouter from '@/router.ts';

const { PORT } = getEnv();
const app = express();

const TAKE_HEAP_SNAPSHOT = () => {
    const snapshotPath = v8.writeHeapSnapshot();
    console.log(`Heap snapshot taken and saved to ${snapshotPath}`);
};

app.use(cors());
app.use(requestLogger);
app.use('/api', proxyRouter);

app.get('/debug/heap-snapshot', (req, res) => {
    TAKE_HEAP_SNAPSHOT();
    res.send('Heap snapshot taken');
});

app.listen(PORT, () => {
    console.info(`Server Running on port: ${PORT}`);
});
