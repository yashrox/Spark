import { DaoManager } from '../../../database/mongodb';
import { user } from './user.model';
import { IUser } from './user.interface';
import { CONSTANT } from '../../app.constant';
import {USER_CONSTANT} from './user.constant';
import {sessionService} from '../session/session.service';
import * as bcrypt from 'bcrypt';
import { environment } from '../../../utils/env.utils';

class UserServcie extends DaoManager {
    readonly DocumentModel = user;
    constructor() {
        super(user);
    }

    async addUser(data: any): Promise<{token: string, profile: any}> {
        try {
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

        // generate hash for password
        const hashPassword =  bcrypt.hashSync(data.password, environment.saltRound);
        delete data.password;
        data  = Object.assign(data , {hash_password: hashPassword});
        const result = await this.create(data);

        // @todo create session generate token
        const token = await sessionService.createSession(result._id, 
            {device_type: data.device_type, device_token: data.device_token})
        return {profile: result , token};
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async login(data: any): Promise<{token: string, profile: any}> {
        try {
            const query: any = {status: {$ne: CONSTANT.STATUS.DELETE}}
            if (data.primary_field === IUser.PrimaryField.EMAIL) {
                query.email = data.user;
            } else {
                query.phone_number = data.user;
            }
            const userData = await this.findOne(query, {}, {}, {});
            if (!userData) {
                return Promise.reject({status: 400, message: USER_CONSTANT.NOT_FOUND});
            }
            if (userData === CONSTANT.STATUS.INACTIVE) {
                return Promise.reject({status: 401, message: USER_CONSTANT.INACTIVE_ACCOUNT});
            }
            if (!bcrypt.compareSync(data.password, userData.hash_password)) {
                return Promise.reject({status: 401, message: USER_CONSTANT.PASSWORD_MISMATCH});
            }
            const token = await sessionService.createSession(userData._id, 
                {device_type: data.device_type || 1, device_token: data.device_token || 'string'})
            return {profile: userData , token};
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getUserData(userId: string) {
        return await this.findById(userId, {}, {});
    }

    async list(data: any): Promise<any> {
        const query = {$or: [{name: {$regex: data.search , $options: '-i'}},  {phone_number: {$regex: data.search, $options: '-i'} }]};
        return await this.find(query, {hash_password: 0, primary_field: 0}, {}, {}, {pageNo: +data.page, limit: +data.limit});
    }

    async logout(session: string): Promise<void> {
        console.log('............', session);
        await sessionService.removeSingleSession(session);
        return;
    }
}

export const userService = new UserServcie();