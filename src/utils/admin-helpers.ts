import crypto from 'crypto';
import Category from '../models/category';
import Session from '../models/session';
import Task from '../models/task';
import Team from '../models/team';

export const generateCode = async (): Promise<string> => {
    const randomCode = crypto
        .randomBytes(12)
        .toString('base64url')
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
};

export const getTeamsList = async (): Promise<
    { name: string; code: string; sessions: number }[]
> => {
    const teams = await Team.findAll({ include: Session });

    return teams.map(team => ({
        name: team.name,
        code: team.inviteCode || 'N/A',
        sessions: team.sessions?.length || 0
    }));
};

export const getTaskList = async () => {
    const tasks = await Task.findAll({ include: Category });

    return tasks.map(task => ({
        id: task.id,
        name: task.name,
        description: task.description,
        points: task.points,
        flag: task.flag,
        category: {
            id: task.category?.id,
            name: task.category?.name
        }
    }));
};

export const getCategoryList = async () => {
    const categories = await Category.findAll();
    return categories.map(category => ({
        id: category.id,
        name: category.name
    }));
};

export const dataObjects = {
    adminPanel: async () => ({ teamList: await getTeamsList() }),
    taskPanel: async () => ({
        tasks: await getTaskList(),
        categories: await getCategoryList()
    })
};
