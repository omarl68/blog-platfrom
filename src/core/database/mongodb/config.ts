import mongoose from 'mongoose';
import logger from '../../utils/logger';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Database Connected with Host: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`Connection Error => ${error.message}`);
    // Wait and retry connection
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
