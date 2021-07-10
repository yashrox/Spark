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
const express = require("express");
const env_utils_1 = require("../utils/env.utils");
const cors = require("cors");
const helmet = require("helmet");
const mongoose_1 = require("mongoose");
const app_routes_1 = require("../app/app.routes");
class Application {
    constructor() {
        this.instance = express();
        this.port = env_utils_1.environment.port;
    }
    static init() {
        const app = new Application();
        app.load().then(() => {
            app.instance.listen(app.port, () => {
                console.log(`Server Listening on port <${app.port}>`);
            });
        }).catch((error) => {
            console.log(error);
            console.error(error.message || 'App Loading failed');
            process.exit(1);
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initConfig();
            yield Promise.all([
                this.initDatabase(),
            ]);
            this.instance.use(app_routes_1.apiRoutes.path, app_routes_1.apiRoutes.router);
        });
    }
    initDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            mongoose_1.set('debug', true);
            const { uri } = env_utils_1.environment.mongodb;
            const options = {
                useCreateIndex: true,
                useNewUrlParser: true,
            };
            mongoose_1.connect(uri, options).catch((err) => {
                console.error(err.message);
                process.exit(1);
            });
            console.info(`Connecting Mongo Database`);
            yield new Promise(mongoose_1.connection.once.bind(mongoose_1.connection, 'open'));
            console.info('Mongo Database Connected');
        });
    }
    initConfig() {
        this.instance.use(cors({ origin: '*' }));
        this.instance.use(helmet());
        this.instance.use(express.json());
        this.instance.use(express.urlencoded());
        this.instance.use((err, req, res, next) => {
            console.error('...ERROR MIddleware....', err);
            res.status(err.status || err).send(err.message || 'Something broke!');
        });
    }
}
try {
    // Initialize Application
    Application.init();
}
catch (error) {
    console.error(error);
}
