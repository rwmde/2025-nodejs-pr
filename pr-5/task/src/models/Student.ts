import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'students', timestamps: false })
export class Student extends Model<Student> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  age!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  group!: string;
}
