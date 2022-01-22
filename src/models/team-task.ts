import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Task from "./task";
import Team from "./team";

@Table
export default class TeamTask extends Model {
    @ForeignKey(() => Team)
    @Column
    teamId!: number;

    @ForeignKey(() => Task)
    @Column
    taskId!: number;
}
