import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'roles', timestamps: false })
export class Role extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string; // Example: "admin", "teacher", "student"
}
