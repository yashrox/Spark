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
const session_model_1 = require("./session.model");
const mongodb_1 = require("../../../database/mongodb");
const jwt_utils_1 = require("../../../utils/jwt.utils");
class SessionService extends mongodb_1.DaoManager {
    constructor() {
        super(session_model_1.session);
    }
    createSession(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.updateMany({ user_id: userId }, { is_active: false }, {});
                const sessionObject = Object.assign(Object.assign({}, data), { user_id: userId });
                const sessionResult = yield this.create(sessionObject);
                const tokenObject = {
                    id: userId,
                    session: sessionResult._id,
                };
                return jwt_utils_1.tokenUtil.generateAuthToken(tokenObject, '30d');
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    /**
     * @description For single login application
     */
    removeActiveSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updateMany({ user_id: userId }, { is_active: false }, {});
        });
    }
    /**
     * @description For multiple login application
     */
    removeSingleSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updateOne({ _id: sessionId }, { is_active: false }, {});
        });
    }
}
exports.sessionService = new SessionService();
