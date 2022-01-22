import express from 'express';
import { engine } from 'express-handlebars';
import { Database } from './db';
import apiRouter from './routes/api';
import adminRouter from './routes/admin';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import crypto from 'crypto';
import Session from './models/session';
import Team from './models/team';

export const startExpress = (database: Database) => {
    if (!process.env.SECRET) {
        throw new Error('Environment variable SECRET not set');
    }

    const app = express();

    app.use(cookieParser());
    app.use(session({
        secret: process.env.SECRET,
        cookie: { path: '/', sameSite: true, httpOnly: true },
        saveUninitialized: false,
        resave: false
    }));

    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/views');

    app.use('/css', express.static('src/css'))
    app.use('/static', express.static('static'))

    app.use('/admin', adminRouter());
    app.use('/api', apiRouter(database));

    app.get('/', (req, res) => {
        res.render('home');
    });
    

    app.listen(8080, () => {
        console.log('Running Fribyte CTF listening on http://localhost:8080');
    });
};
