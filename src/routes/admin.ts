import express from 'express';
import crypto from 'crypto';
import Session from '../models/session';
import Team from '../models/team';
import bodyParser from 'body-parser';
import Task from '../models/task';
import Category from '../models/category';

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

        res.render('admin', { teamList: await getTeamsList() });
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
        res.render('admin', { teamList: await getTeamsList() });
    });

    router.post('/team', async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.render('admin', { error: 'Mangler lagnavn.', teamList: await getTeamsList() });
        }
        
        const code = await generateCode();
        
        const team = await Team.create({ name, inviteCode: code });
        
        res.render('admin', { message: `Nytt team laget. Navn: ${team.name} - Kode: ${team.inviteCode}`, teamList: await getTeamsList() });
        
    });

    router.get('/task', async (req, res) => {
        res.render('admin-tasks', { tasks: await getTaskList(), categories: await getCategoryList() });
    });

    router.post('/task', async (req, res) => {
        const { id, name, description, flag, points, categoryId } = req.body;
        if (!name || !description || !flag || !points || !categoryId) {
            return res.render('admin-tasks', { error: 'Mangler inputs', tasks: await getTaskList(), categories: await getCategoryList() });
        }

        if (id) {
            await Task.update({ name, description, flag, points, categoryId }, { where: { id: +id } });
            await Task.sync();
        } else {
            await Task.create({ name, description, flag, points, categoryId });
        }

        res.render('admin-tasks', { tasks: await getTaskList(), categories: await getCategoryList(), message: 'Ny oppgave laget' });
    });

    router.post('/category', async (req, res) => {
        const { id, name } = req.body;
        if (!name) {
            return res.render('admin-tasks', { error: 'Mangler navn', tasks: await getTaskList(), categories: await getCategoryList() });
        }

        if (id) {
            await Category.update({ name }, { where: { id: +id } });
            await Category.sync();
        } else {
            await Category.create({ name });
        }
        return res.render('admin-tasks', { tasks: await getTaskList(), categories: await getCategoryList() });
    });

    return router;
};

const getTeamsList = async (): Promise<{ name: string, code: string, sessions: number }[]> => {
    const teams = await Team.findAll({ include: Session });

    return teams.map(team => ({
        name: team.name,
        code: team.inviteCode || 'N/A',
        sessions: team.sessions?.length || 0
    }));
}

const getTaskList = async () => {
    const tasks = await Task.findAll({ include: Category });

    return tasks.map(task => ({
        name: task.name,
        description: task.description,
        points: task.points,
        flag: task.flag,
        category: {
            id: task.category?.id,
            name: task.category?.name
        }
    }));
}

const getCategoryList = async () => {
    const categories = await Category.findAll();
    return categories.map(category => ({
        id: category.id,
        name: category.name
    }));
}

const generateCode = async (): Promise<string> => {
    const randomCode = crypto.randomBytes(12).toString('base64url')
    .toUpperCase()
    .split('')
    .filter(c => ['-', '=', '_', '0', 'O', 'I'].every(v => c !== v))
    .join('')
    .slice(0, 5);
    if (randomCode.length !== 5) {
        return generateCode();
    }

    const team = await Team.findOne({ where: { inviteCode: randomCode } });
    if (team) {
        return generateCode();
    }

    return randomCode;
}
