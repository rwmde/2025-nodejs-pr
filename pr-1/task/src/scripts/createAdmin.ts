import { User, Role } from '../models';
import sequelize from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync();

        let adminRole = await Role.findOne({ where: { name: 'admin' } });
        if (!adminRole) {
            adminRole = await Role.create({ name: 'admin' });
            console.log('Created admin role');
        }

        const email = 'admin@example.com';
        const password = 'adminpassword';

        let adminUser = await User.findOne({ where: { email } });
        if (adminUser) {
            console.log('Admin user already exists');
        } else {
            adminUser = await User.create({
                email,
                password,
                name: 'System',
                surname: 'Admin',
                roleId: adminRole.id
            });
            console.log(`Admin user created: ${email} / ${password}`);
        }

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await sequelize.close();
    }
};

createAdmin();
