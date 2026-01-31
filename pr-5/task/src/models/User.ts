import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from './Role';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  surname!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string; // hashed password

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false })
  roleId!: string;

  @BelongsTo(() => Role)
  role!: Role;
}
