import { DaoManager } from '@src/database/mongodb';
import { user } from './user.model';
import { IUser } from './user.interface';
import { CONSTANT } from '@src/app/app.constant';
import {USER_CONSTANT} from './user.constant';

class UserServcie extends DaoManager {
    readonly DocumentModel = user;
    constructor() {
        super(user);
    }

    async addUser(data: any) {
        const isExistsQuery: any = { status: { '$ne': CONSTANT.STATUS.DELETE }};
        
        if (data.primary_field === IUser.PrimaryField.EMAIL) {
            isExistsQuery['email'] = data.email;
            if (await this.count({ ...isExistsQuery })) {
                return Promise.reject({status: 422 ,  reason: USER_CONSTANT.EMAIL_EXISTS});
            }
        } else {
            isExistsQuery['phone_number'] = data.phone_number;
            if (await this.count({ ...isExistsQuery })) {
                return Promise.reject({status: 422 ,  reason: USER_CONSTANT.PHONE_EXISTS});
            }
        }

        const result = this.create(data);
        // @todo create session generate token
        return result;
    }

}

export const userService = new UserServcie();