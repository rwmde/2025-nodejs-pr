import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'subjects', timestamps: false })
export class Subject extends Model<Subject> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  subjectName!: string;
}
