import express from 'express';
import { Database } from '../db';

export default (database: Database) => {
    const router = express.Router();

    router.use(express.json());

    router.post('/team', (req, res) => {
        const { name } = req.body;
        if (!name) {
            res.status(401).send('missing name');
            return;
        }
        console.log('create team');
        database.models.Team.create({ name })
        res.send('created team ' + name);
    });

    router.get('/team', async (req, res) => {
        const { name } = req.query;
        if (!name) {
            res.status(401).send('missing name');
            return;
        }
        const team = await database.models.Team.findOne({ where: { name } });
        if (!team) {
            return res.status(404).send(`team ${name} not found`);
        }
        res.send(team.get());
    });

    return router;
};
