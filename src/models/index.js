import mongoose from 'mongoose';
import Configspec from './configspec';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
const models = { Configspec };
 
export { connectDb };
export default models;
