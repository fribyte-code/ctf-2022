import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import Task from './task';

@Table
export default class Category extends Model {
    @Column
    name!: string;

    @HasMany(() => Task)
    tasks?: Task[];
}
