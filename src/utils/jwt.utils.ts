import { sign, verify, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { environment } from './env.utils';
import { CONSTANT } from '../app/app.constant';
import { sessionService } from '../app/api/session';
import { userService } from '../app/api/user/user.service';

class TokenUtil {
    generateAuthToken(payload: { [key: string]: any }, expiresIn?: number | string) {
        const { secrets } = environment;
        const options: SignOptions = {};
        if (expiresIn) {
            options.expiresIn = expiresIn;
        }
        return sign(payload, secrets, options);
    }

    verifyAuthToken(token: string, options?: VerifyOptions) {
        const { secrets } = environment;
        return verify(token, secrets, options);
    }

    async authorize(token: string): Promise<any> {
        const verifiedUser: any = this.verifyAuthToken(token);
        if (!verifiedUser) {
            return Promise.reject({ status: 401, message: CONSTANT.AUTHORIZATION.NO_ACCESS });
        }
        // check session is active
        const isSessionActive = await sessionService.findOne({ _id: verifiedUser.session, is_active: true }, {}, {}, {});
        if (!isSessionActive) {
            return Promise.reject({ status: 401, message: CONSTANT.AUTHORIZATION.EXPIRED });
        }
        const userData  = await userService.getUserData(verifiedUser.id);
        if (!userData) {
            return Promise.reject({status: 400, message: CONSTANT.AUTHORIZATION.NOT_FOUND});
        }
        if (userData.status === CONSTANT.STATUS.INACTIVE) {
            return Promise.reject({status: 401, message: CONSTANT.AUTHORIZATION.INACTIVE_ACCOUNT});
   
        }
        return verifiedUser as {id: string, session: string, iat: number, exp: number};
    }
}

export const tokenUtil = new TokenUtil();