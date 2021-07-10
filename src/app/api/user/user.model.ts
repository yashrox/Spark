import {Document, Schema, model, Model} from 'mongoose';
import * as mongoose from 'mongoose';
import {IUser} from './user.interface';
import {CONSTANT} from '@app/app.constant';

interface IUserModel extends Document {
id: string;
name: string;
email: string;
contact: string;
gender: number;
country: string;
primary_field: number;
status: number;
}

const userSchema = new Schema({
    id: {type: mongoose.Schema.Types.ObjectId, index: true, required: true},
    name: {type: 'string', required: true},
    phone_number: {type: 'string', required: false, default: ''},
    gender: {type: 'number', enum: [...Object.values(IUser.Gender)]},
    email: {type: 'string', lowercase: true,  default: ''},
    country: {type: 'string', required: true},
    primary_field: {type: 'number', enum: [...Object.values(IUser.PrimaryField)]},
    status: {type: 'number', enum: [...Object.values(CONSTANT.STATUS)]},
})

export const user: Model<IUserModel> = model<IUserModel>(CONSTANT.DOCUMENT_MODEL.USER , userSchema);