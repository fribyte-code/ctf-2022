// import { DataTypes, Model, Sequelize } from "sequelize";

import { BelongsTo, Column, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import Base from "./base-model";
import Team from "./team";

// export default (sequelize: Sequelize) => {
//     class Session extends Model {


//     }
//     Session.init({
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             unique: true,
//             primaryKey: true
//         }
//     }, { sequelize });
//     return Session;
// };

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
