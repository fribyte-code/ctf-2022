import { Column, CreatedAt, DataType, Default, IsUUID, Model, NotNull, PrimaryKey, UpdatedAt } from "sequelize-typescript";
import crypto from 'crypto';

export default class Base extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id!: string;

    @CreatedAt
    creationDate!: Date;
  
    @UpdatedAt
    updatedOn!: Date;
}
