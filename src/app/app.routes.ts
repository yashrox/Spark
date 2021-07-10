import { Router, NextFunction } from 'express';
import {userRoute} from '../app/api/user/user.routes';
import {App} from '../app/app.interface';

const router: Router = Router();

router.use(userRoute.path, userRoute.router);

router.use((req: App.Request, res: App.Response, next: NextFunction) => {
	next({status: 400, message: 'Not Found'});
});

router.use((err: any, req: App.Request, res: App.Response, next: NextFunction) => {
   console.log(err);
    res.json({
        status: err.status,
        message: err.message,
    })
});

export const apiRoutes  = {path: '/spark', router};