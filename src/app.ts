import { startExpress } from './express';
import { Database } from "./db";
import dotenv from 'dotenv';
import Team from './models/team';

dotenv.config();


(async () => {
    const database = new Database();
    await database.init();
    startExpress(database);
})();

const createAdminTeam = async (database: Database) => {
    Team.create();

}
