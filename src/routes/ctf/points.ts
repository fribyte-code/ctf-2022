import express from 'express';
import { mapTaskModelToObject } from '../../mappers';
import Task from '../../models/task';
import Team from '../../models/team';

export default () => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const tasks = await Task.findAll({
            order: [['points', 'ASC']],
            include: {
                model: Team,
                attributes: ['id'],
                where: {
                    id: req.team?.id
                },
                through: {
                    attributes: []
                }
            }
        });

        return res.render('points', {
            tasks: tasks.map(mapTaskModelToObject),
            info: {
                teamName: req.team?.name,
                points: tasks.reduce((prev, curr) => curr.points + prev, 0),
                solvedTasks: tasks.length
            },
            selected: req.selectedNavigationItem
        });
    });

    return router;
};
