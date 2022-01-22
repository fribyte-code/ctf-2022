import { BelongsTo, BelongsToMany } from 'sequelize-typescript';
// import { DataTypes, Model, Sequelize } from "sequelize";

import { AllowNull, Column, ForeignKey, HasMany, Model, NotNull, Table } from "sequelize-typescript";
import Base from "./base-model";
import Session from "./session";
import Task from "./task";
import TeamTask from './team-task';

// export default (sequelize: Sequelize) => {
//     class Team extends Model {
        
//     }

//     Team.init({
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             unique: true,
//             primaryKey: true
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         inviteCode: {
//             type: DataTypes.STRING
//         }
//     }, { sequelize });
//     return Team;
// };

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
