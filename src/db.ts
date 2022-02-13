import { Sequelize } from 'sequelize-typescript';
import { ModelOptions } from 'sequelize/types/model';
import Category from './models/category';
import Session from './models/session';
import Task from './models/task';
import Team from './models/team';
import TeamTask from './models/team-task';

export const initDatabase = async () => {
    let sequelize: Sequelize;
    if (process.env.DB_POSTGRES_CONNECTION_STRING) {
        console.info('Using Postgres database');
        sequelize = new Sequelize(process.env.DB_POSTGRES_CONNECTION_STRING, {
            dialect: 'postgres',
            define: {
                underscored: true,
                freezeTableName: true,
                charset: 'utf8',
                dialectOptions: {
                    collate: 'utf8_general_ci'
                }
            }
        } as ModelOptions);
    } else {
        console.info('Using SQLite database');
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'db.sqlite'
        });
    }

    // test db connection
    await sequelize.authenticate();

    // models
    sequelize.addModels([Team, Session, Task, TeamTask, Category]);

    // Order is important for relational models
    Team.sync();
    Session.sync();
    Category.sync();
    Task.sync();
    TeamTask.sync();

    // create admin team
    const adminteam = await Team.findByPk(0);
    if (!adminteam) {
        await Team.create({ id: 0, name: 'admin' });
    }
};
