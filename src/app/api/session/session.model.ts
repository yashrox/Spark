import {Document, Schema, model, Model} from 'mongoose';
import * as mongoose from 'mongoose';
import {CONSTANT} from '../../app.constant';

interface ISessionModel extends Document {
device_token?: string;
device_type: number;
socket_id?: string;
is_active: boolean;
access_token?: string;
ip_address?: string;
user_id: string;
}

const sessionSchema = new Schema({
    device_token: {type: 'string', default: ''},
    device_type: {type: 'number', enum: [...Object.values(CONSTANT.DEVICE_TYPE)], default: CONSTANT.DEVICE_TYPE.ANDROID},
    socket_id: {type: 'string', default: ''},
    is_active: {type: 'boolean', default: true},
    access_token: {type: 'string', default: ''},
    ip_address: {type: 'string', default: ''},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: CONSTANT.DOCUMENT_MODEL.USER, required: true}
}, {
    timestamps: true,
});

export const session: Model<ISessionModel> = model<ISessionModel>(CONSTANT.DOCUMENT_MODEL.SESSION , sessionSchema);