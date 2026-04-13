import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Permission from '../models/Permission';
import Role from '../models/Role';
import User from '../models/User';
import Team from '../models/Team';

dotenv.config();

const permissions = [
  { name: 'users:read', module: 'Users', description: 'Read users' },
  { name: 'users:create', module: 'Users', description: 'Create users' },
  { name: 'users:update', module: 'Users', description: 'Update users' },
  { name: 'users:delete', module: 'Users', description: 'Delete users' },
  
  { name: 'roles:read', module: 'Roles', description: 'Read roles' },
  { name: 'roles:create', module: 'Roles', description: 'Create roles' },
  { name: 'roles:update', module: 'Roles', description: 'Update roles' },
  { name: 'roles:delete', module: 'Roles', description: 'Delete roles' },
  
  { name: 'teams:read', module: 'Teams', description: 'Read teams' },
  { name: 'teams:create', module: 'Teams', description: 'Create teams' },
  { name: 'teams:update', module: 'Teams', description: 'Update teams' },
  { name: 'teams:delete', module: 'Teams', description: 'Delete teams' },
  
  { name: 'audit:read', module: 'AuditLogs', description: 'Read audit logs' }
];

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected!');

    // Clear existing base data to avoid conflicts, EXCEPT users
    await Permission.deleteMany({});
    await Role.deleteMany({});
    await Team.deleteMany({});
    
    // Insert permissions
    console.log('Inserting permissions...');
    const createdPermissions = await Permission.insertMany(permissions);
    const permissionIds = createdPermissions.map(p => p._id);

    // Create Admin Role
    console.log('Creating Admin role...');
    const adminRole = await Role.create({
      name: 'Admin',
      description: 'Super Administrator',
      scope: 'GLOBAL',
      permissions: permissionIds
    });

    // Create User Role
    console.log('Creating User role...');
    const userReadPerm = createdPermissions.find(p => p.name === 'users:read');
    const userRole = await Role.create({
      name: 'User',
      description: 'Standard User',
      scope: 'SELF',
      permissions: userReadPerm ? [userReadPerm._id] : []
    });
    
    // Create Default Team
    console.log('Creating Default Team...');
    const team = await Team.create({
        name: 'Default Team',
        description: 'The starting team'
    });

    // Check if superadmin exists, if not create one
    const existingAdmin = await User.findOne({ email: 'admin@system.com' });
    if (!existingAdmin) {
       console.log('Creating super admin user...');
       const salt = await bcrypt.genSalt(10);
       const passwordHash = await bcrypt.hash('admin123', salt);
       
       await User.create({
           name: 'Super Admin',
           email: 'admin@system.com',
           passwordHash,
           role: adminRole._id,
           team: team._id
       });
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
