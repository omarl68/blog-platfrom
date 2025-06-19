import { RolesEnum } from '../../constants/constants';
import { seedAdmin } from './Admin';
import { seedDelete } from './drop';
import { seedRoles } from './roles';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';
export let seed = async (args = { clearDatabase: false }) => {
  if (args.clearDatabase) await seedDelete();
  await seedRoles([RolesEnum.ADMIN, RolesEnum.EDITOR, RolesEnum.WRITER, RolesEnum.READER]);
  await seedAdmin(
    RolesEnum.ADMIN,
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_PASS,
    process.env.ADMIN_NAME,
  );
  console.log('✅ Seeder executed successfully');
  process.exit(1);
};

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return seed();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
