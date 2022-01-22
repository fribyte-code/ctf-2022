import { startExpress } from './express';
import { initDatabase } from './db';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
    await initDatabase();
    startExpress();
})();
