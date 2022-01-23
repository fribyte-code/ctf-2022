import { mapCategoryModelToObject } from './../mappers';
import Category from '../models/category';

export const dataObjects = {
    frontPage: async () => {
        const categories = await Category.findAll({
            order: [['name', 'DESC']]
        });
        return {
            categories: categories.map(mapCategoryModelToObject)
        };
    }
};
