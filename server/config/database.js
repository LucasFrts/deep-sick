import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(process.env.DATABASE_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB conectado em', process.env.DATABASE_CONNECTION);
  } catch (error) {
    console.error('❌ Falha ao conectar com MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;