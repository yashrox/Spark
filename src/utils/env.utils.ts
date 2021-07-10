import { join } from 'path';
import { readFileSync } from 'fs';

export const environment = ((env: 'local') => {
	console.info('Environment Configuration Started : ' + env);
	env = 'local';
	const envPath: string = join(process.cwd(), 'environment', `${env}.json`);
	try {
		const configData = readFileSync(envPath, {encoding: 'utf-8'} );
		const config = JSON.parse(configData);
		return config;
	} catch (err) {
		console.error('>> Environment Load Error');
		console.error(err);
		process.exit(0);
	}
})(process.env.NODE_ENV as any);
