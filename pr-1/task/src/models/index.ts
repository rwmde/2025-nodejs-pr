import User from './User';
import Student from './Student';
import Role from './Role';
import Subject from './Subject';
import Grade from './Grade';

// User <-> Role
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// Student <-> Grade
Student.hasMany(Grade, { foreignKey: 'studentId' });
Grade.belongsTo(Student, { foreignKey: 'studentId' });

// Subject <-> Grade
Subject.hasMany(Grade, { foreignKey: 'subjectId' });
Grade.belongsTo(Subject, { foreignKey: 'subjectId' });

export { User, Student, Role, Subject, Grade };
