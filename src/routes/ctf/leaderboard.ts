import { Sequelize } from 'sequelize-typescript';
import express from 'express';
import Task from '../../models/task';
import Team from '../../models/team';
import { Op } from 'sequelize';

export default () => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const teams = await Team.findAll({
            attributes: ['name'],
            where: {
                id: {
                    [Op.not]: 0
                }
            },
            include: {
                model: Task,
                attributes: ['points'],
                through: {
                    attributes: []
                }
            }
        });

        res.render('leaderboard', {
            leaderboard: teams
                .map(team => ({
                    rank: 0,
                    name: team.name,
                    points:
                        team.completedTasks?.reduce(
                            (prev, curr) => curr.points + prev,
                            0
                        ) || 0,
                    solved: team.completedTasks?.length || 0
                }))
                .sort((a, b) => b.points - a.points)
                .map((team, i) => ({ ...team, rank: i + 1 })),
            selected: req.selectedNavigationItem
        });
    });

    return router;
};
