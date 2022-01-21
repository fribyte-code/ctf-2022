import { DataTypes, Model, Sequelize } from "sequelize";

const Team = (sequelize: Sequelize) => {
    return sequelize.define('Team', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        inviteCode: {
            type: DataTypes.STRING
        }
    });
};

export default Team;
