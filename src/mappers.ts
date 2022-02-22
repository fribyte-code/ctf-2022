import Category from './models/category';
import Task from './models/task';

export const mapTaskModelToObject = (task: Task, teamId: number) => {
    return {
        id: task.id,
        name: task.name,
        description: task.description,
        points: task.points || 0,
        solved: task.completedTeams?.some(task => task.id === teamId),
        solvedCount: task.completedTeams?.length || 0
    };
};

export const mapCategoryModelToObject = (category: Category) => {
    return {
        id: category.id,
        name: category.name
    };
};
