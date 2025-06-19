import { Schema, model, Document, Types } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import { RolesEnum } from '../../constants/constants';

export const ROLE_DOCUMENT_NAME = 'Role';
export const ROLE_COLLECTION_NAME = 'roles';



export default interface IRole extends Document {
    code: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }

  const schema = new Schema<IRole>(
    {
      code: {
        type: Schema.Types.String,
        required: true,
        enum: [RolesEnum.ADMIN, RolesEnum.EDITOR, RolesEnum.WRITER , RolesEnum.READER],
      },
      status: {
        type: Schema.Types.Boolean,
        default: true,
      },
      createdAt: {
        type: Date,
        required: true,
        select: false,
      },
      updatedAt: {
        type: Date,
        required: true,
        select: false,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

schema.plugin(mongoosePagination);


export const Role = model<IRole, Pagination<IRole>>(
    ROLE_DOCUMENT_NAME,
    schema,
    ROLE_COLLECTION_NAME,
);
