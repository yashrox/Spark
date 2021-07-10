"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DOCUMENT_MODEL = {
    USER: 'user',
    SESSION: 'session',
};
var STATUS;
(function (STATUS) {
    STATUS[STATUS["ACTIVE"] = 1] = "ACTIVE";
    STATUS[STATUS["INACTIVE"] = 2] = "INACTIVE";
    STATUS[STATUS["DELETE"] = 3] = "DELETE";
})(STATUS || (STATUS = {}));
var DEVICE_TYPE;
(function (DEVICE_TYPE) {
    DEVICE_TYPE[DEVICE_TYPE["IOS"] = 1] = "IOS";
    DEVICE_TYPE[DEVICE_TYPE["ANDROID"] = 2] = "ANDROID";
    DEVICE_TYPE[DEVICE_TYPE["WEB"] = 3] = "WEB";
})(DEVICE_TYPE || (DEVICE_TYPE = {}));
const AUTHORIZATION = {
    VALID: 'Authorization is verified.',
    EXPIRED: 'Authorization is expired.',
    INVALID: 'Authorization is not valid',
    REQUIRED: 'Authorization is required',
    NO_ACCESS: 'You are not authorized to access',
    INVALID_MEHTOD: 'Invalid authorization method',
    NOT_FOUND: 'User is not registered with us or moved permanently.',
    INACTIVE_ACCOUNT: 'Not authorized to access , your account is blocked.',
};
exports.CONSTANT = Object.freeze({
    DOCUMENT_MODEL,
    STATUS,
    AUTHORIZATION,
    DEVICE_TYPE,
});
