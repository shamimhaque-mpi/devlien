import readline from 'readline';
import process from 'process';
import { exec } from 'child_process';
import Package from './package.js';
import Migration from './migration.js';
import Model from './model.js';
import Controller from './controller.js';
import Resource from './resource.js';
import Seeder from './seeder.js';
import path from 'path';
import Cache from './cache.js';
import os from "os";
import { promisify } from 'util';
import Terminal from "./terminal.js";

export default class Execution {

    execPromise = promisify(exec);

    constructor(){
        Cache.clear();
        this.base_path = process.cwd();
        this.os = os.platform();
        this.terminal = new Terminal;
    }


    static start(fn){
        fn(new Execution(), process.argv.slice(2))
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


    async createSeeder(modelName){
        Seeder.create(modelName, this.terminal);
    }


    async DBSeed(modelName=null){
        Seeder.execute(modelName, this.terminal);
    }

    cacheClear(){
        this.terminal.addLine('cache @space clearing')
        Cache.clear();
        this.terminal.addLine('cache @space cleared', 'success')
    }

    async copyDemo(){

        var cmd_core_files = `cp -R ${this.base_path}/node_modules/devlien/libraries/core/* ${path.join(this.base_path, '')}`;
        var cmd_views_files = `cp -R ${path.join(this.base_path, '/node_modules/devlien/libraries/demo/*')} ${path.join(this.base_path, '')}`;
        var cmd_env_clone  = `cp ${path.join(this.base_path, '/node_modules/devlien/libraries/demo/.env')} ${this.base_path}`;


        if(this.os=='win32'){
            cmd_core_files = `xcopy "${path.join(this.base_path, 'node_modules/devlien/libraries/core')}" "${path.join(this.base_path, '')}" /E /I /Y`;
            cmd_views_files = `xcopy "${path.join(this.base_path, 'node_modules/devlien/libraries/demo')}" "${path.join(this.base_path, '')}" /E /I /Y`;
            cmd_env_clone  = `xcopy "${path.join(this.base_path, 'node_modules/devlien/libraries/demo/.env')}" "${this.base_path}" /Y`;
        }

        try {
            this.terminal.addLine('Core files are being generated @space processing');
            await this.execPromise(cmd_core_files);
            await this.delay(500);
            await this.execPromise(cmd_views_files);
            await this.delay(500);
            await this.execPromise(cmd_env_clone);
            await this.delay(500);
            this.terminal.addLine('Core files have been generated @space done', 'success');

            this.terminal.addLine('System is preparing @space processing');
            await this.execPromise('npx devlien cache:clear');
            this.terminal.addLine('System is ready to go @space done', 'success');
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }




    async copyNuxtDemo(){


        var cmd_core_files = `cp -R ${this.base_path}/node_modules/devlien/libraries/core/* ${path.join(this.base_path, 'server/')}`;
        var cmd_nuxt_files = `cp -R ${path.join(this.base_path, '/node_modules/devlien/libraries/nuxt/*')} ${path.join(this.base_path, '/')}`;
        var cmd_env_clone  = `cp ${path.join(this.base_path, '/node_modules/devlien/libraries/nuxt/server/.env')} ${this.base_path}`;
        var cmd_env_remov  = `rm -rf ${path.join(this.base_path, 'server/.env')}`;


        if(this.os=='win32'){
            cmd_core_files = `xcopy "${path.join(this.base_path, 'node_modules/devlien/libraries/core')}" "${path.join(this.base_path, 'server')}" /E /I /Y`;
            cmd_nuxt_files = `xcopy "${path.join(this.base_path, 'node_modules/devlien/libraries/nuxt')}" "${path.join(this.base_path, '')}" /E /I /Y`;
            cmd_env_clone  = `xcopy "${path.join(this.base_path, 'node_modules/devlien/libraries/nuxt/server/.env')}" "${this.base_path}" /Y`;
            cmd_env_remov = `del /F /Q "${path.join(this.base_path, 'server/.env')}"`;
        }

        try {
            
            this.terminal.addLine('Nuxtjs config is being updated @space processing');
            await this.execPromise(cmd_nuxt_files);
            await this.delay(500);
            this.terminal.addLine('Nuxtjs config has been updated @space done', 'success');


            this.terminal.addLine('Core files are being generated @space processing');
            await this.execPromise(cmd_core_files);
            await this.delay(500);
            this.terminal.addLine('Core files have been generated @space done', 'success');


            this.terminal.addLine('Environment variables are being updated @space processing');
            await this.execPromise(cmd_env_clone);
            await this.delay(500);
            await this.execPromise(cmd_env_remov);
            await this.delay(500);
            this.terminal.addLine('Environment variables have been updated @space done', 'success');

            
            this.terminal.addLine('System is preparing @space processing');
            await this.execPromise('npx devlien cache:clear');
            this.terminal.addLine('System is ready to go @space done', 'success');

        } catch (error) {
            console.error("Error occurred:", error);
        }
    }

    async copyNextDemo(){


        var cmd_core_files = `cp -R ${this.base_path}/node_modules/devlien/libraries/core/* ${path.join(this.base_path, 'server/')}`;
        var cmd_nuxt_files = `cp -R ${path.join(this.base_path, '/node_modules/devlien/libraries/next/*')} ${path.join(this.base_path, '/')}`;
        var cmd_env_clone  = `cp ${path.join(this.base_path, '/node_modules/devlien/libraries/next/.env')} ${this.base_path}`;


        if(this.os=='win32'){
            cmd_core_files = `xcopy "${path.join(this.base_path, 'node_modules/devlien/libraries/core')}" "${path.join(this.base_path, 'server')}" /E /I /Y`;
            cmd_nuxt_files = `xcopy "${path.join(this.base_path, 'node_modules/devlien/libraries/next')}" "${path.join(this.base_path, '/')}" /E /I /Y`;
            cmd_env_clone  = `xcopy "${path.join(this.base_path, 'node_modules/devlien/libraries/next/.env')}" "${this.base_path}" /Y`;
        }

        try {

            this.terminal.addLine('Core files are being generated @space processing');
            await this.execPromise(cmd_nuxt_files);
            await this.delay(500);
            await this.execPromise(cmd_core_files);
            await this.delay(500);
            this.terminal.addLine('Core files have been generated @space done', 'success');


            this.terminal.addLine('Environment variables are being updated... @space processing');
            await this.execPromise(cmd_env_clone);
            await this.delay(500);
            this.terminal.addLine('Environment variables have been updated @space done', 'success');


            this.terminal.addLine('System is preparing updated... @space processing');
            await this.execPromise('npx devlien cache:clear');
            this.terminal.addLine('System is ready to go @space done', 'success');

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