import { Sequelize } from 'sequelize-typescript';
import express from 'express';
import { engine } from 'express-handlebars';
import adminRouter from './routes/admin';
import ctfRouter from './routes/ctf';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import Session from './models/session';
import Team from './models/team';

export const startExpress = () => {
    const app = express();

    app.use(cookieParser());

    app.engine(
        'handlebars',
        engine({
            helpers: {
                equals(a: string, b: string) {
                    return a === b;
                }
            }
        })
    );
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/../views');

    app.use('/static', express.static(__dirname + '/../static'));

    app.use('/admin', adminRouter());
    app.use('/auth', authRouter());

    app.use('/', (req, res, next) => {
        req.app.locals.layout = 'main';
        next();
    });

    app.get('/', (req, res) => {
        if (req.cookies.session) {
            return res.redirect('/ctf');
        }
        res.render('home');
    });

    app.use('/', async (req, res, next) => {
        const { session: sessionId } = req.cookies;
        const session = await Session.findByPk(sessionId, {
            include: Team
        });
        if (!session) {
            res.clearCookie('session');
            return res.redirect('/');
        }
        req.team = session.team;
        next();
    });

    app.use('/ctf', ctfRouter());

    app.listen(process.env.PORT || 8080, () => {
        console.log(
            `Running Fribyte CTF listening on http://localhost:${
                process.env.PORT || 8080
            }`
        );
    });
};
