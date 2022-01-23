import bodyParser from 'body-parser';
import express from 'express';
import Team from '../models/team';
import crypto from 'crypto';
import Session from '../models/session';

export default () => {
    const router = express.Router();

    router.use(bodyParser.urlencoded({ extended: false }));

    router.post('/login', async (req, res) => {
        let { code } = req.body;

        if (!code) {
            return res.redirect('/?error=no-code');
        }
        code = String(code).toUpperCase();

        const team = await Team.findOne({ where: { inviteCode: code } });
        if (!team) {
            return res.redirect('/?error=invalid-code');
        }

        const id = crypto.randomUUID();
        await Session.create({ id, teamId: team.id });
        res.cookie('session', id, { httpOnly: true, sameSite: true });

        res.redirect('/ctf');
    });

    router.get('/logout', async (req, res) => {
        const { session: sessionId } = req.cookies;

        const session = await Session.findByPk(sessionId);
        if (!session) {
            res.clearCookie('session');
            return res.redirect('/');
        }
        await session.destroy();

        res.clearCookie('session');
        res.redirect('/');
    });

    return router;
};
