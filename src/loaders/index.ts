import expressLoader from './express.loader';
import mongooseLoader from './mongoose.loader';

export default async ({ expressApp }) => {
  await mongooseLoader();
  await expressLoader({ app: expressApp });
}