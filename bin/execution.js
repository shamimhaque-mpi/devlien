import process from 'process';
import { exec } from 'child_process';
import Package from './package.js';
import Model from './model.js';
import Controller from './controller.js';
import Request from './request.js';
import Resource from './resource.js';
import path, { join } from 'path';
import Cache from './cache.js';
import os from "os";
import { promisify } from 'util';
import Terminal from "./terminal.js";
import color from '../utilities/colours.js';

import Migration from './migration.js';
import Seeder from './seeder.js';

var DIR = (await import('devlien/dir')).default;

export default class Execution {

    execPromise = promisify(exec);

    constructor(){
        this.base_path = process.cwd();
        this.os = os.platform();
        this.terminal = new Terminal;
    }


    start(fn){
        fn(new Execution(), process.argv.slice(2), this.terminal)
    }


    async createMigration(name){
        Migration.create(name, this.terminal);
    }


    runMigrate(){
        Migration.execute(this.terminal);
    }

    runMigrateRollback(param=null){
        Migration.rollback(param, this.terminal);
    }


    async createModel(modelName){
        Model.create(modelName, this.terminal);
    }


    async createController(modelName){
        Controller.create(modelName, this.terminal);
    }


    async createResource(modelName){
        Resource.create(modelName, this.terminal);
    }


    async createRequest(requestName){
        Request.create(requestName, this.terminal);
    }


    async createSeeder(modelName){
        Seeder.create(modelName, this.terminal);
    }


    async DBSeed(modelName=null){
        Seeder.execute(modelName, this.terminal);
    }

    cacheClear(){
        this.terminal.addLine('cache @space CLEANING')
        Cache.clear();
        this.terminal.addLine('cache @space CLEANED', 'success')
    }

    async copyDemo(param=null){
        try {
            this.terminal.addLine('Core files are being generated @space PROCESSING');
            await DIR.copy(`${this.base_path}/node_modules/devlien/libraries/core/`, `${path.join(this.base_path, '')}`);
            await DIR.copy(`${this.base_path}/node_modules/devlien/libraries/root/`, `${path.join(this.base_path, '')}`);
            this.terminal.addLine('Core files have been generated @space DONE', 'success');
            
            await this.createEnv();

            this.terminal.addLine('package.json is updating @space PROCESSING');
            await Package.add((json)=>{
                delete json.scripts.dev;
                json.type="module";
                json.scripts = {...{dev:"devlien dev"}, ...json.scripts};
            })
            .save();
            await this.delay(500);
            this.terminal.addLine('package.json have been updated @space PROCESSED', 'success');


            this.terminal.addLine('System is preparing @space PROCESSING');
            await this.defaultAssets();
            await this.execPromise('npx devlien cache:clear');
            this.terminal.addLine('System is ready to go @space DONE', 'success');

            if(param && param.includes("--installer")){
                console.log(color.info, "\n🎉 app has been created successfully!");
                console.log(color.info, '👉 To get started: \n');
                console.log(color.success, `   cd ${path.basename(process.cwd())}`);
                console.log(color.success, '   npm run dev\n');
                console.log(color.info, '   Happy coding! 🚀\n');
            }


        } catch (error) {
            console.error("Error occurred:", error);
        }
    }


    async copyNuxtDemo(){
        try {
            this.terminal.addLine('Nuxtjs config is being updated @space PROCESSING');
            await DIR.copy(`${path.join(this.base_path, '/node_modules/devlien/libraries/nuxt/')}`, `${this.base_path}`);
            this.terminal.addLine('Nuxtjs config has been updated @space DONE', 'success');


            this.terminal.addLine('Core files are being generated @space PROCESSING');
            await DIR.copy(`${this.base_path}/node_modules/devlien/libraries/core/`, `${path.join(this.base_path, '/server')}`);
            await DIR.copy(`${this.base_path}/node_modules/devlien/libraries/root/`, `${path.join(this.base_path, '')}`);
            await DIR.copy(`${path.join(this.base_path, '/node_modules/devlien/libraries/nuxt/')}`, `${this.base_path}`);
            this.terminal.addLine('Core files have been generated @space DONE', 'success');

            await this.createEnv();

            this.terminal.addLine('package.json is updating @space PROCESSING');
            await this.delay(500);
            await Package.add((json)=>{
                delete json.scripts.dev;
                json.type="module";
                json.scripts = {...{dev:"devlien dev nuxt"}, ...json.scripts};
            })
            .save();
            await this.delay(500);
            this.terminal.addLine('package.json have been updated @space PROCESSED', 'success');
            
            this.terminal.addLine('System is preparing @space PROCESSING');
            await this.configAPIServer('nuxt');
            await this.defaultAssets();
            await this.execPromise('npx devlien cache:clear');
            this.terminal.addLine('System is ready to go @space DONE', 'success');

        } 
        catch (error) {
            console.error("Error occurred:", error);
        }
    }

    async copyNextDemo(){

        try {

            this.terminal.addLine('Nextjs config is being updated @space PROCESSING');
            await DIR.copy(`${path.join(this.base_path, '/node_modules/devlien/libraries/next/')}`, `${this.base_path}`);
            this.terminal.addLine('Nextjs config has been updated @space DONE', 'success');


            this.terminal.addLine('Core files are being generated @space PROCESSING');
            await DIR.copy(`${this.base_path}/node_modules/devlien/libraries/core/`, `${path.join(this.base_path, '/server')}`);
            await DIR.copy(`${this.base_path}/node_modules/devlien/libraries/root/`, `${path.join(this.base_path, '')}`);
            await DIR.copy(`${path.join(this.base_path, '/node_modules/devlien/libraries/next/')}`, `${this.base_path}`);
            this.terminal.addLine('Core files have been generated @space DONE', 'success');

            await this.createEnv();

            this.terminal.addLine('package.json is updating @space PROCESSING');
            await this.delay(500);
            await Package.add((json)=>{
                delete json.scripts.dev;
                json.type="module";
                json.scripts = {...{dev:"devlien dev next"}, ...json.scripts};
            })
            .save();
            await this.delay(500);
            this.terminal.addLine('package.json have been updated @space PROCESSED', 'success');

            
            this.terminal.addLine('System is preparing updated... @space PROCESSING');
            await this.configAPIServer('next');
            await this.defaultAssets();
            await this.execPromise('npx devlien cache:clear');
            this.terminal.addLine('System is ready to go @space DONE', 'success');

        } catch (error) {
            console.error("Error occurred:", error);
        }
        
    }


    async createEnv(){
        this.terminal.addLine('Environment variables are being updated @space PROCESSING');
        await DIR.copy(`${path.join(this.base_path, '/node_modules/devlien/libraries/standard/env.example')}`, `${this.base_path}/.env`);
        this.terminal.addLine('Environment variables have been updated @space DONE', 'success');
    }

    async configAPIServer(type='next'){
        
        const config = (await DIR.import(path.resolve('devlien.config.js'))).default;
        const basePath = path.join(process.cwd(), config.root);

        await DIR.remove(path.join(basePath, 'resources'));
        await DIR.remove(path.join(basePath, 'routes/web.js'));
        await DIR.remove(path.join(basePath, 'devlien.config.js'));
        await DIR.copy(path.join(process.cwd(), 'node_modules/devlien/libraries/single/RouteServiceProvider.js'), path.join(basePath, 'app/Providers/RouteServiceProvider.js')); 
    }


    async defaultAssets(){
        const config = (await DIR.import(path.resolve('devlien.config.js'))).default;
        const basePath = path.join(process.cwd(), config.root);

        const userMigrationName = (new Date().toISOString().split('T')[0]).split('-').join('_')+"_"+Math.floor(Date.now() / 1000)+'_users.js';
        const defaultMigration = path.join(basePath, 'database/migrations/0000_00_00_0000_users.js');
        
        const migrations = DIR.scan('database/migrations', config.root);

        if((migrations.join('-').replace('0000_00_00_0000_users.js', '').indexOf('_users.js')>-1)){
            DIR.remove(defaultMigration);
        }
        else if(DIR.path(defaultMigration).isExist()){
            DIR.move(defaultMigration, path.join(basePath, 'database/migrations', userMigrationName));
        }
    }


    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}