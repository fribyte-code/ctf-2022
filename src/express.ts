import express from 'express';
import { engine } from 'express-handlebars';
import { Database } from './db';
import apiRouter from './routes/api';

export const startExpress = (database: Database) => {
    const app = express();

    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/views');

    app.use('/css', express.static('src/css'))
    app.use('/static', express.static('static'))

    app.use('/api', apiRouter(database));

    app.get('/', (req, res) => {
        res.render('home');
    });

    app.listen(8080, () => {
        console.log('Running Fribyte CTF listening on http://localhost:8080');
    });
};
