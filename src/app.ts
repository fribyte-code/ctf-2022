import { startExpress } from './express';
import { initDatabase } from './db';
import dotenv from 'dotenv';
import { startWebsocket } from './websocket';

dotenv.config();

(async () => {
    await initDatabase();
    const app = startExpress();
    startWebsocket(app);
})();
