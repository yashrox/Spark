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
const jsonwebtoken_1 = require("jsonwebtoken");
const env_utils_1 = require("./env.utils");
const app_constant_1 = require("../app/app.constant");
const session_1 = require("../app/api/session");
const user_service_1 = require("../app/api/user/user.service");
class TokenUtil {
    generateAuthToken(payload, expiresIn) {
        const { secrets } = env_utils_1.environment;
        const options = {};
        if (expiresIn) {
            options.expiresIn = expiresIn;
        }
        return jsonwebtoken_1.sign(payload, secrets, options);
    }
    verifyAuthToken(token, options) {
        const { secrets } = env_utils_1.environment;
        return jsonwebtoken_1.verify(token, secrets, options);
    }
    authorize(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifiedUser = this.verifyAuthToken(token);
            if (!verifiedUser) {
                return Promise.reject({ status: 401, message: app_constant_1.CONSTANT.AUTHORIZATION.NO_ACCESS });
            }
            // check session is active
            const isSessionActive = yield session_1.sessionService.findOne({ _id: verifiedUser.session, is_active: true }, {}, {}, {});
            if (!isSessionActive) {
                return Promise.reject({ status: 401, message: app_constant_1.CONSTANT.AUTHORIZATION.EXPIRED });
            }
            console.log(isSessionActive);
            const userData = yield user_service_1.userService.getUserData(verifiedUser.id);
            if (!userData) {
                return Promise.reject({ status: 400, message: app_constant_1.CONSTANT.AUTHORIZATION.NOT_FOUND });
            }
            if (userData.status === app_constant_1.CONSTANT.STATUS.INACTIVE) {
                return Promise.reject({ status: 401, message: app_constant_1.CONSTANT.AUTHORIZATION.INACTIVE_ACCOUNT });
            }
            return verifiedUser;
        });
    }
}
exports.tokenUtil = new TokenUtil();
