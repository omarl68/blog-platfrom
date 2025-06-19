import mongoose from 'mongoose';
import { EMOJIS } from '../../constants/constants';

export let seedDelete = async () => {
  const collections = mongoose.modelNames();
  const deletedCollections = collections.map((collection) =>
    mongoose.models[collection].deleteMany({}),
  );
  await Promise.all(deletedCollections);
  console.log('Collections empty successfuly ' + EMOJIS.SUCCESS);
};
