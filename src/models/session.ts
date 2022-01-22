import {
    BelongsTo,
    Column,
    Default,
    ForeignKey,
    IsUUID,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import Team from './team';

@Table
export default class Session extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: string;

    @BelongsTo(() => Team)
    team!: Team;

    @ForeignKey(() => Team)
    @Column
    teamId!: number;

    @Default(true)
    @Column
    active!: boolean;
}
