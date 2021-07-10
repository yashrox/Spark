import {Router} from 'express'
import {session} from '../../middlewares/session';
import {userController} from './user.controller';
const router = Router();

router.post('/register' , session(), userController.addUser);
router.post('/login', session(), userController.loginUser);
router.get('/', session(), userController.list);
router.delete('/logout', session(), userController.logout);

export const userRoute = {path: '/user', router};