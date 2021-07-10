import {CONSTANT} from '../app.constant';
import {App} from '../app.interface';
import {tokenUtil} from '../../utils/jwt.utils';

const BASIC_TOKEN = 'c3Bhcms6c3Bhcms=';
export function session() {
    return async (req: App.Request, res: App.Response, next: App.NextFunction) => {
       try {
        const { authorization }  = req.headers;
        if (!authorization) {
            return next({status: 400, message: CONSTANT.AUTHORIZATION.REQUIRED});
        }
        const [type , token] = authorization.split(' ');
       
        if (type === 'Basic') {
            if (token === BASIC_TOKEN) {
                return next();
            }
            return next({status: 401, message: CONSTANT.AUTHORIZATION.INVALID});
        } else if (type == 'Bearer') {
            req.user = await tokenUtil.authorize(token);
            return next();
        }
        return next({status: 401, message: CONSTANT.AUTHORIZATION.INVALID});
       } catch (error) {
        return next(error);
       }
    }
}