import express from 'express';
import { engine } from 'express-handlebars';
import adminRouter from './routes/admin';
import ctfRouter from './routes/ctf';
import cookieParser from 'cookie-parser';

export const startExpress = () => {
    const app = express();

    app.use(cookieParser());

    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '/../views');

    app.use('/static', express.static(__dirname + '/../static'));

    app.use('/admin', adminRouter());
    app.use('/ctf', ctfRouter());

    app.get('/', (req, res) => {
        res.render('home');
    });

    app.listen(process.env.PORT || 8080, () => {
        console.log(
            `Running Fribyte CTF listening on http://localhost:${
                process.env.PORT || 8080
            }`
        );
    });
};
