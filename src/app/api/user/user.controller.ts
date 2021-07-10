import { userService } from './user.service';
import { App } from '../../app.interface';
import { USER_CONSTANT } from './user.constant';
import { NextFunction } from 'express';
class UserController {

    async addUser(req: App.Request, res: App.Response, next: App.NextFunction): Promise<any> {
        try {
            const data = req.body;
            const userData = await userService.addUser(data);
            res.json({status: 200, message: USER_CONSTANT.CREATED, data: userData});
        } catch (error) {
            next({status: 500, message: error.message});
        }
    }

    async loginUser(req: App.Request, res: App.Response, next: App.NextFunction): Promise<any> {
        try {
            let data = req.body;
            const { device_type, device_token} = req.headers;
            data = Object.assign(data , {
                device_type, device_token,
            });
            const userData = await userService.login(data);
            res.json({status: 200, message: USER_CONSTANT.LOGIN, data: userData});
        } catch (error) {
            next({status: error.status || 500, message: error.message});
        }
    }

    async list(req: App.Request, res: App.Response, next: NextFunction) {
        try {
            let data = req.query;
            const userData = await userService.list(data);
            res.json({status: 200, message: 'Success', data: userData});
        } catch (error) {
            next({status: error.status || 500, message: error.message});
        }
    }

    async logout(req: App.Request, res: App.Response, next: App.NextFunction) {
        try {
            const session  = req?.user?.session || '';
            await userService.logout(session);
            res.json({status: 200, message: USER_CONSTANT.LOGOUT});
        } catch (error) {
            next({status: error?.status || 500 , message: error.message || error});
        }
    }
}

export const userController = new UserController();