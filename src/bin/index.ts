import * as express from 'express';
import { environment } from '../utils/env.utils';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { MongoError } from 'mongodb';
import { connect, connection, set, ConnectionOptions } from 'mongoose';
import {apiRoutes} from '../app/app.routes';

class Application {
    private instance = express();
    private port: number;
    constructor() {
        this.port = environment.port;
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

    async load() {
        this.initConfig();
        await Promise.all([
            this.initDatabase(),
        ]);
        this.instance.use(apiRoutes.path, apiRoutes.router);
    }

    async initDatabase() {
        set('debug', true);
        const { uri } = environment.mongodb;
        const options: ConnectionOptions = {
            useCreateIndex: true,
            useNewUrlParser: true,
        };
        connect(uri, options).catch((err: MongoError) => {
            console.error(err.message);
            process.exit(1);
        });
        console.info(`Connecting Mongo Database`);
        await new Promise(connection.once.bind(connection, 'open'));
        console.info('Mongo Database Connected');
    }

    initConfig() {
        this.instance.use(cors({ origin: '*' }));
        this.instance.use(helmet());
        this.instance.use(express.json());
        this.instance.use(express.urlencoded());
        this.instance.use((err: any, req: express.Request,
            res: express.Response, next: express.NextFunction) => {
            console.error('...ERROR MIddleware....', err);
            res.status(err.status || err).send(err.message || 'Something broke!');
        });
    }
}

try {
    // Initialize Application
    Application.init();
} catch (error) {
    console.error(error);
}