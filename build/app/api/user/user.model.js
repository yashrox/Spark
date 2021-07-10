"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const app_constant_1 = require("../../app.constant");
const userSchema = new mongoose_1.Schema({
    name: { type: 'string', required: true },
    phone_number: { type: 'string', required: false, default: '' },
    gender: { type: 'number', enum: [...Object.values(user_interface_1.IUser.Gender)] },
    email: { type: 'string', lowercase: true, default: '' },
    country: { type: 'string', required: true },
    primary_field: { type: 'number', enum: [...Object.values(user_interface_1.IUser.PrimaryField)] },
    status: { type: 'number', enum: [...Object.values(app_constant_1.CONSTANT.STATUS)], default: app_constant_1.CONSTANT.STATUS.ACTIVE },
    hash_password: { type: 'string', required: true },
}, {
    timestamps: true,
});
exports.user = mongoose_1.model(app_constant_1.CONSTANT.DOCUMENT_MODEL.USER, userSchema);
