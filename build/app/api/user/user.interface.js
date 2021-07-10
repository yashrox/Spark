"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IUser;
(function (IUser) {
    let Gender;
    (function (Gender) {
        Gender[Gender["MALE"] = 1] = "MALE";
        Gender[Gender["FEMALE"] = 2] = "FEMALE";
        Gender[Gender["OTHER"] = 3] = "OTHER";
    })(Gender = IUser.Gender || (IUser.Gender = {}));
    let PrimaryField;
    (function (PrimaryField) {
        PrimaryField[PrimaryField["EMAIL"] = 1] = "EMAIL";
        PrimaryField[PrimaryField["PHONE_NUMBER"] = 2] = "PHONE_NUMBER";
    })(PrimaryField = IUser.PrimaryField || (IUser.PrimaryField = {}));
})(IUser = exports.IUser || (exports.IUser = {}));
