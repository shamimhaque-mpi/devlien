import readline from 'readline';
import process from 'process';
import { exec } from 'child_process';
import Package from './package.js';
import Migration from './migration.js';
import Model from './model.js';
import Controller from './controller.js';
import Resource from './resource.js';
import path from 'path';
import Cache from './cache.js';
import os from "os";
import { promisify } from 'util';

export default class Execution {

    execPromise = promisify(exec);

    constructor(){
        Cache.clear();
        this.base_path = process.cwd();
        this.os = os.platform();
    }


    static start(fn){
        fn(new Execution(), process.argv.slice(2))
    }


    async createMigration(name){
        Migration.create(name);
    }


    async createModel(modelName){
        Model.create(modelName);
    }


    async createController(modelName){
        Controller.create(modelName);
    }


    async createResource(modelName){
        Resource.create(modelName);
    }


    runMigrate(){
        Migration.execute();
    }

    runMigrateRollback(param=null){
        Migration.rollback(param);
    }

    cacheClear(){
        Cache.clear();
    }

    copyDemo(){
        exec(`cp -R ${this.base_path}/node_modules/deepline/libraries/demo/. ${this.base_path}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
        });
    }




    async copyNuxtDemo(){

        var cmd_core_files = `cp -R ${this.base_path}/node_modules/deepline/libraries/core/* ${path.join(this.base_path, 'server/')}`;
        var cmd_nuxt_files = `cp -R ${path.join(this.base_path, '/node_modules/deepline/libraries/nuxt/*')} ${path.join(this.base_path, 'server/')}`;
        var cmd_env_clone  = `cp ${path.join(this.base_path, '/node_modules/deepline/libraries/nuxt/.env')} ${this.base_path}`;
        var cmd_env_remov  = `rm -rf ${path.join(this.base_path, 'server/.env')}`;


        if(this.os=='win32'){
            cmd_core_files = `xcopy "${path.join(this.base_path, 'node_modules/deepline/libraries/core')}" "${path.join(this.base_path, 'server')}" /E /I /Y`;
            cmd_nuxt_files = `xcopy "${path.join(this.base_path, 'node_modules/deepline/libraries/nuxt')}" "${path.join(this.base_path, 'server')}" /E /I /Y`;
            cmd_env_clone  = `xcopy "${path.join(this.base_path, 'node_modules/deepline/libraries/nuxt/.env')}" "${this.base_path}" /Y`;
            cmd_env_remov = `del /F /Q "${path.join(this.base_path, 'server/.env')}"`;
        }

        try {

            console.log('Core files are being generated...');
            await this.execPromise(cmd_core_files);
            console.log('\x1b[32m%s\x1b[0m', 'Core files have been generated.\n');

            console.log('Nuxtjs config is being updated...');
            await this.execPromise(cmd_nuxt_files);
            console.log('\x1b[32m%s\x1b[0m', 'Nuxtjs config has been updated.\n');

            console.log('Environment variables are being updated...');
            await this.execPromise(cmd_env_clone);
            await this.execPromise(cmd_env_remov);
            console.log('\x1b[32m%s\x1b[0m', 'Environment variables have been updated.\n');


            console.log('System is preparing...');
            await this.execPromise('npx deepline cache:clear');
            console.log('\x1b[32m%s\x1b[0m', 'System is ready to go.\n')

        } catch (error) {
            console.error("Error occurred:", error);
        }
    }

    async copyNextDemo(){


        var cmd_core_files = `cp -R ${this.base_path}/node_modules/deepline/libraries/core/* ${path.join(this.base_path, 'server/')}`;
        var cmd_nuxt_files = `cp -R ${path.join(this.base_path, '/node_modules/deepline/libraries/next/*')} ${path.join(this.base_path, '/')}`;
        var cmd_env_clone  = `cp ${path.join(this.base_path, '/node_modules/deepline/libraries/next/.env')} ${this.base_path}`;


        if(this.os=='win32'){
            cmd_core_files = `xcopy "${path.join(this.base_path, 'node_modules/deepline/libraries/core')}" "${path.join(this.base_path, 'server')}" /E /I /Y`;
            cmd_nuxt_files = `xcopy "${path.join(this.base_path, 'node_modules/deepline/libraries/next')}" "${path.join(this.base_path, '/')}" /E /I /Y`;
            cmd_env_clone  = `xcopy "${path.join(this.base_path, 'node_modules/deepline/libraries/next/.env')}" "${this.base_path}" /Y`;
        }

        try {

            console.log('Nuxtjs config is being updated...');
            await this.execPromise(cmd_nuxt_files);
            console.log('\x1b[32m%s\x1b[0m', 'Nuxtjs config has been updated.\n');

            await this.delay(1000);

            console.log('Core files are being generated...');
            await this.execPromise(cmd_core_files);
            console.log('\x1b[32m%s\x1b[0m', 'Core files have been generated.\n');

            await this.delay(1000);

            console.log('Environment variables are being updated...');
            await this.execPromise(cmd_env_clone);
            console.log('\x1b[32m%s\x1b[0m', 'Environment variables have been updated.\n');

            await this.delay(1000);

            console.log('System is preparing...');
            await this.execPromise('npx deepline cache:clear');
            console.log('\x1b[32m%s\x1b[0m', 'System is ready to go.\n')

        } catch (error) {
            console.error("Error occurred:", error);
        }
        
    }


    updatePackageJson(){
        Package.add((json)=>{
            json.type="module";
            json.scripts = {...{dev:"nodemon ./server.js"}, ...json.scripts};
        })
        .save();
    }




    ask(question, choices) {
        return new Promise(resolve => {
            
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
    
            let currentIndex = 0;
    
            function render() {
                console.clear();
                console.log(question+'\n');
                choices.forEach((choice, i) => {
                    const selected = i === currentIndex ? '◉' : '◯';
                    console.log(` ${selected} ${choice}`);
                });
                console.log('\nUse arrow keys (↑ ↓) and press Enter');
            }
    
            render();
    
            readline.emitKeypressEvents(process.stdin);
            process.stdin.setRawMode(true);
    
            process.stdin.on('keypress', (_, key) => {
                if (key.name === 'up') {
                    currentIndex = (currentIndex - 1 + choices.length) % choices.length;
                    render();
                } 
                else if (key.name === 'down') {
                    currentIndex = (currentIndex + 1) % choices.length;
                    render();
                } 
                else if (key.name === 'return') {
                    rl.close();
                    process.stdin.setRawMode(false);
                    resolve(choices[currentIndex]);
                } 
                else if (key.ctrl && key.name === 'c') {
                    rl.close();
                    process.exit();
                }
            });
        });
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}