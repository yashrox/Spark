import {Document, Schema, model, Model} from 'mongoose';
import {IUser} from './user.interface';
import {CONSTANT} from '../../app.constant';

interface IUserModel extends Document {
name: string;
email: string;
phone_number: string;
gender: number;
country: string;
primary_field: number;
status: number;
hash_password: string;
}

const userSchema = new Schema({
    name: {type: 'string', required: true},
    phone_number: {type: 'string', required: false, default: ''},
    gender: {type: 'number', enum: [...Object.values(IUser.Gender)]},
    email: {type: 'string', lowercase: true,  default: ''},
    country: {type: 'string', required: true},
    primary_field: {type: 'number', enum: [...Object.values(IUser.PrimaryField)]},
    status: {type: 'number', enum: [...Object.values(CONSTANT.STATUS)], default: CONSTANT.STATUS.ACTIVE},
    hash_password: {type: 'string', required: true},
}, {
    timestamps: true,
})

export const user: Model<IUserModel> = model<IUserModel>(CONSTANT.DOCUMENT_MODEL.USER , userSchema);