"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const app_constant_1 = require("../../app.constant");
const sessionSchema = new mongoose_1.Schema({
    device_token: { type: 'string', default: '' },
    device_type: { type: 'number', enum: [...Object.values(app_constant_1.CONSTANT.DEVICE_TYPE)], default: app_constant_1.CONSTANT.DEVICE_TYPE.ANDROID },
    socket_id: { type: 'string', default: '' },
    is_active: { type: 'boolean', default: true },
    access_token: { type: 'string', default: '' },
    ip_address: { type: 'string', default: '' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: app_constant_1.CONSTANT.DOCUMENT_MODEL.USER, required: true }
}, {
    timestamps: true,
});
exports.session = mongoose_1.model(app_constant_1.CONSTANT.DOCUMENT_MODEL.SESSION, sessionSchema);
