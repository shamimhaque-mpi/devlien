import colours from '../../utilities/colours.js'
import { spawn } from 'child_process';
import { baseEnv } from 'devlien/env';
import path from 'path';
import fs from 'fs';

export default class Watcher {

	server = null;
	watcher = null;

	static start(isFrame=false) {

		let _this = new this();

		try{
			if(isFrame && isFrame=='nuxt'){
				spawn('npx', ['nuxt', 'dev'], {stdio:'inherit'});
			}
			else if(isFrame && isFrame=='next'){
				spawn('npx', ['next', 'dev', '--turbopack'], {stdio:'inherit'});
			}

			_this.isFrame = isFrame;
			_this.onChange((eventType, filename) => {
				console.log(`\n${colours.text('ℹ', 'secondary')} `+filename, colours.text(eventType, 'success'));
				_this.reloadServer(isFrame);
			});

			if (!_this.server) _this.reloadServer(isFrame);
		}
		catch(e){
			console.log(e)
			if( _this.server)  _this.server.kill();
		}
	}


	reloadServer(isFrame) {

		if(!isFrame){
			if (this.server) {
				console.log(`\n${colours.text('⏳', 'info')} Server is reloading`);
				this.server.kill();
			} 
			else {
				console.clear();
				console.log('Server is starting')
			};

			this.server = spawn('node', [path.join(process.cwd(), 'node_modules/devlien/bin/server/AppServer.js')], {
				stdio: 'inherit',
			});
		}
		else{
			var configFile = 'nuxt.config.ts';
			if(isFrame && isFrame=='next')
				configFile = 'next.config.ts';
			const now = new Date();
			fs.utimes(path.join(process.cwd(), configFile), now, now, err => {});
		}
	}


	onChange(fn = null) {

		const ignored = ['node_modules', 'tmp', '.git', 'ignore.txt'];

		fs.watch(this.isFrame ? baseEnv.BASE_PATH : '.', { recursive: true }, (eventType, filename) => {

			const isIgnored = ignored.some(ignoredPath =>
				filename.startsWith(ignoredPath)
			);

			if(!isIgnored){
				if (this.watcher) clearTimeout(this.watcher);
				this.watcher = setTimeout(() => {
					if (filename && (filename.endsWith('.js') || filename.endsWith('.dl')) && fn) {
						fn(eventType, filename);
					}
				}, 300);
			}
		});
	}
}

