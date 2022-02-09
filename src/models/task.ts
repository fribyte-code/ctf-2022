import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from 'sequelize-typescript';
import Category from './category';
import Team from './team';
import TeamTask from './team-task';

@Table
export default class Task extends Model {
    @Column
    name!: string;

    @Column(DataType.TEXT)
    description!: string;

    @Column
    points!: number;

    @Column
    flag!: string;

    @BelongsTo(() => Category)
    category?: Category;

    @ForeignKey(() => Category)
    categoryId?: number;

    @BelongsToMany(() => Team, () => TeamTask)
    completedTeams?: Team[];
}
