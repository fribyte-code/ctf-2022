import { Sequelize } from 'sequelize-typescript';
import Base from './models/base-model';
import Category from './models/category';
import Session from './models/session';
import SessionModel from './models/session';
import Task from './models/task';
import Team from './models/team';
import TeamModel from './models/team';
import TeamTask from './models/team-task';


export class Database {
    private sequelize: Sequelize;
    
    constructor() {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite'
        });
    }

    async init() {
        // test db connection
        await this.sequelize.authenticate();

        
        // models
        this.sequelize.addModels([Team, Session, Task, TeamTask, Category]);

        Team.sync();
        Session.sync();
        Task.sync();
        TeamTask.sync();
        Category.sync();

        // create admin team
        const adminteam = await Team.findByPk(0);
        if (!adminteam) {
            await Team.create({ id: 0, name: 'admin' });
        }
    }


}
