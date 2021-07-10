"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
exports.environment = ((env) => {
    console.info('Environment Configuration Started : ' + env);
    env = 'local';
    const envPath = path_1.join(process.cwd(), 'environment', `${env}.json`);
    try {
        const configData = fs_1.readFileSync(envPath, { encoding: 'utf-8' });
        const config = JSON.parse(configData);
        return config;
    }
    catch (err) {
        console.error('>> Environment Load Error');
        console.error(err);
        process.exit(0);
    }
})(process.env.NODE_ENV);
