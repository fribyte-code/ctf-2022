import { BelongsToMany } from 'sequelize-typescript';
import { AllowNull, Column, HasMany, Model, Table } from 'sequelize-typescript';
import Session from './session';
import Task from './task';
import TeamTask from './team-task';

@Table
export default class Team extends Model {
    @AllowNull(false)
    @Column
    name!: string;

    @AllowNull
    @Column
    inviteCode?: string;

    @HasMany(() => Session)
    sessions?: Session[];

    @BelongsToMany(() => Task, () => TeamTask)
    completedTasks?: Task[];
}
