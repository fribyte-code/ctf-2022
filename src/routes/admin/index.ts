import express from 'express';
import crypto from 'crypto';
import Session from '../../models/session';
import Team from '../../models/team';
import bodyParser from 'body-parser';
import { dataObjects } from '../../utils/admin-helpers';
import adminRouter from './admin';

export default () => {
    const router = express.Router();

    router.use(bodyParser.urlencoded({ extended: false }));

    // authentication
    router.post('/', async (req, res) => {
        const { token } = req.body;
        if (token !== process.env.ADMIN_PASSWORD) {
            return res.status(401).redirect('/admin');
        }

        const id = crypto.randomUUID();
        await Session.create({ id, teamId: 0 });
        res.cookie('session', id, { httpOnly: true, sameSite: true });

        res.render('admin', dataObjects.adminPanel());
    });

    // middleware for authorization
    router.use('/', async (req, res, next) => {
        const { session: sessionId } = req.cookies;

        if (!sessionId) {
            return res.render('admin-login');
        }

        const session = await Session.findByPk(sessionId, { include: Team });

        if (!session || session.teamId != 0) {
            return res.render('admin-login');
        }

        next();
    });

    router.get('/', async (req, res) => {
        res.render('admin', dataObjects.adminPanel());
    });

    router.use('/', adminRouter());

    return router;
};
