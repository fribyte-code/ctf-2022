import { startExpress } from './express';
import { Database } from "./db";


(async () => {
    const database = new Database();
    await database.init();
    startExpress(database);
})();
