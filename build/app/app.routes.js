"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../app/api/user/user.routes");
const router = express_1.Router();
router.use(user_routes_1.userRoute.path, user_routes_1.userRoute.router);
router.use((req, res, next) => {
    next({ status: 400, message: 'Not Found' });
});
router.use((err, req, res, next) => {
    console.log(err);
    res.json({
        status: err.status,
        message: err.message,
    });
});
exports.apiRoutes = { path: '/spark', router };
