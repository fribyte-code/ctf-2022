import express from 'express';
import Team from '../../models/team';
import Task from '../../models/task';
import Category from '../../models/category';
import { dataObjects, generateCode } from '../../utils/admin-helpers';

export default () => {
    const router = express.Router();

    router.post('/team', async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.render('admin', {
                error: 'Mangler lagnavn.',
                ...(await dataObjects.adminPanel())
            });
        }

        const code = await generateCode();

        const team = await Team.create({ name, inviteCode: code });

        res.render('admin', {
            message: `Nytt team laget. Navn: ${team.name} - Kode: ${team.inviteCode}`,
            ...(await dataObjects.adminPanel())
        });
    });

    router.get('/task/delete', async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.render('admin-tasks', {
                error: 'Mangler id',
                ...(await dataObjects.taskPanel())
            });
        }
        const task = await Task.findByPk(+id);
        task?.destroy();
        return res.redirect('/admin/task');
    });

    router.get('/task', async (req, res) => {
        res.render('admin-tasks', await dataObjects.taskPanel());
    });

    router.post('/task', async (req, res) => {
        const { id, name, description, flag, points, categoryId } = req.body;
        console.log({ id, name, description, flag, points });
        if (!name || !description || !flag || !points || !categoryId) {
            return res.render('admin-tasks', {
                error: 'Mangler inputs',
                ...(await dataObjects.taskPanel())
            });
        }

        if (id) {
            await Task.update(
                { name, description, flag, points, categoryId },
                { where: { id: +id } }
            );
            await Task.sync();
        } else {
            await Task.create({ name, description, flag, points, categoryId });
        }

        res.render('admin-tasks', {
            ...(await dataObjects.taskPanel()),
            message: 'Ny oppgave laget'
        });
    });

    router.post('/category', async (req, res) => {
        const { id, name } = req.body;
        if (!name) {
            return res.render('admin-tasks', {
                error: 'Mangler navn',
                ...(await dataObjects.taskPanel())
            });
        }

        if (id) {
            await Category.update({ name }, { where: { id: +id } });
            await Category.sync();
        } else {
            await Category.create({ name });
        }
        return res.render('admin-tasks', await dataObjects.taskPanel());
    });

    return router;
};
