import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Student } from './Student';
import { Subject } from './Subject';

@Table({ tableName: 'grades', timestamps: false })
export class Grade extends Model<Grade> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @ForeignKey(() => Student)
  @Column({ type: DataType.UUID, allowNull: false })
  studentId!: string;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.UUID, allowNull: false })
  subjectId!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  grade!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  evaluatedAt!: Date;

  @BelongsTo(() => Student)
  student!: Student;

  @BelongsTo(() => Subject)
  subject!: Subject;
}
