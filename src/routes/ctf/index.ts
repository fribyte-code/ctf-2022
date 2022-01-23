import { Sequelize } from 'sequelize-typescript';
import { mapCategoryModelToObject } from './../../mappers';
import bodyParser from 'body-parser';
import express from 'express';
import { mapTaskModelToObject } from '../../mappers';
import Category from '../../models/category';
import Task from '../../models/task';
import Team from '../../models/team';
import TeamTask from '../../models/team-task';
import { dataObjects } from '../../utils/ctf-helpers';
import pointsRouter from './points';
import leaderboardRouter from './leaderboard';

export default () => {
    const router = express.Router();

    router.use(bodyParser.urlencoded({ extended: false }));

    router.use('/(:route)?', (req, res, next) => {
        req.selectedNavigationItem = req.params.route || 'ctf';
        next();
    });

    router.use('/points', pointsRouter());
    router.use('/leaderboard', leaderboardRouter());

    router.get('/', async (req, res) => {
        res.render('ctf', {
            ...(await dataObjects.frontPage()),
            selected: req.selectedNavigationItem
        });
    });
    router.get('/category/:name', async (req, res) => {
        const { name } = req.params;
        const categories = await Category.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'DESC']]
        });
        const category = categories.find(category => category.name === name);
        if (!category) {
            return res.redirect('/ctf');
        }
        const tasks = await Task.findAll({
            where: { categoryId: category?.id },
            order: [['points', 'ASC']],
            include: {
                model: Team,
                through: {
                    where: {
                        teamId: req.team?.id
                    },
                    attributes: []
                }
            }
        });

        const { error, success } = req.query;

        res.render('ctf', {
            categories: categories
                .map(mapCategoryModelToObject)
                .map(cat => ({ ...cat, selected: cat.id === category.id })),
            tasks: tasks.map(mapTaskModelToObject),
            error,
            success,
            selected: req.selectedNavigationItem
        });
    });

    router.post('/solve', async (req, res) => {
        const { id, flag } = req.body;
        if (!id || !flag) {
            return res.status(400).send('mssing fields');
        }

        const team = req.team;
        if (!team) {
            return res.status(500).send('error req.team is undefined');
        }

        const task = await Task.findByPk(id, { include: Category });
        if (!task) {
            return res.status(404).send('task not found');
        }

        if (task.flag !== flag) {
            return res.redirect(
                `/ctf/category/${task.category?.name}?error=Feil flagg, prøv igjen`
            );
        }

        await TeamTask.create({ teamId: team.id, taskId: task.id });

        res.redirect(`/ctf/category/${task.category?.name}?success=Korrekt!`);
    });

    return router;
};
