import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Student from './Student';
import Subject from './Subject';

interface GradeAttributes {
    id: number;
    studentId: string;
    subjectId: number;
    grade: number;
    evaluatedAt: Date;
}

interface GradeCreationAttributes extends Optional<GradeAttributes, 'id' | 'evaluatedAt'> { }

class Grade extends Model<GradeAttributes, GradeCreationAttributes> implements GradeAttributes {
    public id!: number;
    public studentId!: string;
    public subjectId!: number;
    public grade!: number;
    public evaluatedAt!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Grade.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Student,
            key: 'id',
        }
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Subject,
            key: 'id',
        }
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 10,
        }
    },
    evaluatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'grades',
});

export default Grade;
