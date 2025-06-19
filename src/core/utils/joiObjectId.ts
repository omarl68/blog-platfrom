import Joi from 'joi';
import mongoose from 'mongoose';

const JoiObjectId = () => Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'Object Id Validation');

export default JoiObjectId; 