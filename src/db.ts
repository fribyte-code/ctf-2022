import { Sequelize } from 'sequelize-typescript';
import Category from './models/category';
import Session from './models/session';
import Task from './models/task';
import Team from './models/team';
import TeamTask from './models/team-task';

export const initDatabase = async () => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'db.sqlite'
    });

    // test db connection
    await sequelize.authenticate();

    // models
    sequelize.addModels([Team, Session, Task, TeamTask, Category]);

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
};
