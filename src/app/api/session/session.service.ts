import { session } from './session.model';
import { DaoManager } from '../../../database/mongodb';
import { tokenUtil } from '../../../utils/jwt.utils';

class SessionService extends DaoManager {
    constructor() {
        super(session);
    }

    async createSession(userId: string, data: any) {
        try {
            await this.updateMany({ user_id: userId }, { is_active: false }, {});

            const sessionObject = {
                ...data,
                user_id: userId,
            }
            const sessionResult = await this.create(sessionObject);
            const tokenObject = {
                id: userId,
                session: sessionResult._id,
            }
            return tokenUtil.generateAuthToken(tokenObject, '30d');
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description For single login application
     */
    async removeActiveSession(userId: string) {
        return await this.updateMany({user_id: userId}, {is_active: false}, {});
    }

    /**
     * @description For multiple login application
     */
    async removeSingleSession(sessionId: string) {
        return await this.updateOne({_id: sessionId}, {is_active: false}, {});
    }

}

export const sessionService = new SessionService();