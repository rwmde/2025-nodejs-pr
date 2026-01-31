import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'students', timestamps: false })
export class Student extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4) // <- UUID
  @Column({ type: DataType.UUID })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  age!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  group!: string;
}
