import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface StudentAttributes {
    id?: number;
    name: string;
    age: number;
    group: number;
}

class Student extends Model<StudentAttributes> implements StudentAttributes {
    public id!: number;
    public name!: string;
    public age!: number;
    public group!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Student.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    group: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'students',
    timestamps: true,
});

export default Student;
