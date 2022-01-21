import { Sequelize } from 'sequelize';
import Team from './models/team';


export class Database {
    private sequelize: Sequelize;
    constructor() {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: __dirname + 'db.sqlite'
        });
    }

    async init() {
        // test db connection
        await this.sequelize.authenticate();

        // create tables from models
        this.models.Team.sync({ alter: true });
    }

    get models() {
        return {
            Team: Team(this.sequelize)
        }
    }
}
