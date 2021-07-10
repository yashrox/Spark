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
const mongodb_1 = require("../../../database/mongodb");
const user_model_1 = require("./user.model");
const user_interface_1 = require("./user.interface");
const app_constant_1 = require("../../app.constant");
const user_constant_1 = require("./user.constant");
const session_service_1 = require("../session/session.service");
const bcrypt = require("bcrypt");
const env_utils_1 = require("../../../utils/env.utils");
class UserServcie extends mongodb_1.DaoManager {
    constructor() {
        super(user_model_1.user);
        this.DocumentModel = user_model_1.user;
    }
    addUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExistsQuery = { status: { '$ne': app_constant_1.CONSTANT.STATUS.DELETE } };
                if (data.primary_field === user_interface_1.IUser.PrimaryField.EMAIL) {
                    isExistsQuery['email'] = data.email;
                    if (yield this.count(Object.assign({}, isExistsQuery))) {
                        return Promise.reject({ status: 422, reason: user_constant_1.USER_CONSTANT.EMAIL_EXISTS });
                    }
                }
                else {
                    isExistsQuery['phone_number'] = data.phone_number;
                    if (yield this.count(Object.assign({}, isExistsQuery))) {
                        return Promise.reject({ status: 422, reason: user_constant_1.USER_CONSTANT.PHONE_EXISTS });
                    }
                }
                // generate hash for password
                const hashPassword = bcrypt.hashSync(data.password, env_utils_1.environment.saltRound);
                delete data.password;
                data = Object.assign(data, { hash_password: hashPassword });
                const result = yield this.create(data);
                // @todo create session generate token
                const token = yield session_service_1.sessionService.createSession(result._id, { device_type: data.device_type, device_token: data.device_token });
                return { profile: result, token };
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { status: { $ne: app_constant_1.CONSTANT.STATUS.DELETE } };
                if (data.primary_field === user_interface_1.IUser.PrimaryField.EMAIL) {
                    query.email = data.user;
                }
                else {
                    query.phone_number = data.user;
                }
                const userData = yield this.findOne(query, {}, {}, {});
                if (!userData) {
                    return Promise.reject({ status: 400, message: user_constant_1.USER_CONSTANT.NOT_FOUND });
                }
                if (userData === app_constant_1.CONSTANT.STATUS.INACTIVE) {
                    return Promise.reject({ status: 401, message: user_constant_1.USER_CONSTANT.INACTIVE_ACCOUNT });
                }
                if (!bcrypt.compareSync(data.password, userData.hash_password)) {
                    return Promise.reject({ status: 401, message: user_constant_1.USER_CONSTANT.PASSWORD_MISMATCH });
                }
                const token = yield session_service_1.sessionService.createSession(userData._id, { device_type: data.device_type || 1, device_token: data.device_token || 'string' });
                return { profile: userData, token };
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findById(userId, {}, {});
        });
    }
    list(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { $or: [{ name: { $regex: data.search, $options: '-i' } }, { phone_number: { $regex: data.search, $options: '-i' } }] };
            return yield this.find(query, { hash_password: 0, primary_field: 0 }, {}, {}, { pageNo: +data.page, limit: +data.limit });
        });
    }
    logout(session) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('............', session);
            yield session_service_1.sessionService.removeSingleSession(session);
            return;
        });
    }
}
exports.userService = new UserServcie();
