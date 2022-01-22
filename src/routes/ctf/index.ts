import express from 'express';
import Category from '../../models/category';
import Task from '../../models/task';

export default () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.render('ctf');
    });
    router.get('/category/:name', async (req, res) => {
        const { name } = req.params;
        const categories = await Category.findAll({
            order: [['name', 'DESC']]
        });
        const category = await Category.findOne({
            where: { name },
            order: [['name', 'DESC']]
        });
        if (!category) {
            return res.redirect('/ctf');
        }
        const tasks = await Task.findAll({
            where: { categoryId: category?.id },
            order: [['points', 'ASC']]
        });

        res.render('ctf', {
            categories: categories.map(cat => ({
                name: cat.name,
                selected: cat.id === category.id
            })),
            tasks: tasks.map(task => ({
                name: task.name,
                description: task.description,
                points: task.points
            }))
        });
    });

    return router;
};
