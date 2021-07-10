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
const app_constant_1 = require("../app.constant");
const jwt_utils_1 = require("../../utils/jwt.utils");
const BASIC_TOKEN = 'c3Bhcms6c3Bhcms=';
function session() {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                return next({ status: 400, message: app_constant_1.CONSTANT.AUTHORIZATION.REQUIRED });
            }
            const [type, token] = authorization.split(' ');
            if (type === 'Basic') {
                if (token === BASIC_TOKEN) {
                    return next();
                }
                return next({ status: 401, message: app_constant_1.CONSTANT.AUTHORIZATION.INVALID });
            }
            else if (type == 'Bearer') {
                req.user = yield jwt_utils_1.tokenUtil.authorize(token);
                return next();
            }
            return next({ status: 401, message: app_constant_1.CONSTANT.AUTHORIZATION.INVALID });
        }
        catch (error) {
            return next(error);
        }
    });
}
exports.session = session;
