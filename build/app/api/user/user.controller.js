"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("./user.service");
const user_constant_1 = require("./user.constant");
class UserController {
    addUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const userData = yield user_service_1.userService.addUser(data);
                res.json({ status: 200, message: user_constant_1.USER_CONSTANT.CREATED, data: userData });
            }
            catch (error) {
                next({ status: 500, message: error.message });
            }
        });
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                const { device_type, device_token } = req.headers;
                data = Object.assign(data, {
                    device_type, device_token,
                });
                const userData = yield user_service_1.userService.login(data);
                res.json({ status: 200, message: user_constant_1.USER_CONSTANT.LOGIN, data: userData });
            }
            catch (error) {
                next({ status: error.status || 500, message: error.message });
            }
        });
    }
    list(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.query;
                const userData = yield user_service_1.userService.list(data);
                res.json({ status: 200, message: 'Success', data: userData });
            }
            catch (error) {
                next({ status: error.status || 500, message: error.message });
            }
        });
    }
    logout(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.session) || '';
                yield user_service_1.userService.logout(session);
                res.json({ status: 200, message: user_constant_1.USER_CONSTANT.LOGOUT });
            }
            catch (error) {
                next({ status: (error === null || error === void 0 ? void 0 : error.status) || 500, message: error.message || error });
            }
        });
    }
}
exports.userController = new UserController();
